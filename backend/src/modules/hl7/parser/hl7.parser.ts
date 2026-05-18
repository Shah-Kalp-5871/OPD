export interface Hl7Segment {
  name: string;
  fields: string[][]; // segmented by '^'
}

export interface Hl7ParsedMessage {
  messageType: string; // e.g. ADT^A08, ORU^R01
  controlId: string;
  segments: Hl7Segment[];
  getSegment(name: string): Hl7Segment | null;
  getFieldValue(segmentName: string, fieldIndex: number, subIndex?: number): string | null;
}

export class Hl7Parser {
  /**
   * Parses raw HL7 v2 message string into structured segments, fields, and sub-components
   */
  static parse(raw: string): Hl7ParsedMessage {
    const lines = raw
      .split(/\r?\n|\r/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const segments: Hl7Segment[] = [];

    for (const line of lines) {
      const parts = line.split('|');
      const segmentName = parts[0];
      const fields: string[][] = [];

      // MSH special handling since | is the first field delimiter
      if (segmentName === 'MSH') {
        fields.push(['|']); // MSH.1 is field separator
        fields.push([parts[1] || '^~\\&']); // MSH.2 is encoding characters
        for (let i = 2; i < parts.length; i++) {
          fields.push(parts[i].split('^'));
        }
      } else {
        for (let i = 1; i < parts.length; i++) {
          fields.push(parts[i].split('^'));
        }
      }

      segments.push({
        name: segmentName,
        fields,
      });
    }

    // Determine Message Type from MSH segment (typically MSH.9)
    const msh = segments.find((s) => s.name === 'MSH');
    let messageType = 'UNKNOWN';
    let controlId = 'UNKNOWN';

    if (msh) {
      // MSH.9 is index 8 (since index 0=MSH.1, 1=MSH.2, 2=MSH.3...)
      const typeField = msh.fields[8];
      if (typeField) {
        messageType = typeField.filter(Boolean).join('^');
      }
      
      const controlField = msh.fields[9];
      if (controlField) {
        controlId = controlField[0] || 'UNKNOWN';
      }
    }

    return {
      messageType,
      controlId,
      segments,
      getSegment(name: string): Hl7Segment | null {
        return segments.find((s) => s.name === name) || null;
      },
      getFieldValue(segmentName: string, fieldIndex: number, subIndex: number = 0): string | null {
        const seg = segments.find((s) => s.name === segmentName);
        if (!seg) return null;
        
        // MSH is 1-indexed differently. Let's normalize lookup indices safely:
        const fields = seg.fields;
        const targetIndex = segmentName === 'MSH' ? fieldIndex - 1 : fieldIndex - 1;
        
        const field = fields[targetIndex];
        if (!field) return null;
        return field[subIndex] || null;
      },
    };
  }

  /**
   * Generates standard HL7 ACK message in response to inbound message
   */
  static generateAck(parsed: Hl7ParsedMessage, status: 'AA' | 'AE' | 'AR' = 'AA', errorMsg?: string): string {
    const now = new Date();
    const timestamp = now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    const mshSegment = parsed.getSegment('MSH');
    const sendingApp = mshSegment?.fields[2]?.[0] || 'EXTERNAL';
    const sendingFac = mshSegment?.fields[3]?.[0] || 'EXTERNAL_FAC';

    const ackMsh = `MSH|^~\\&|MedFlowEMR|MedFlowFacility|${sendingApp}|${sendingFac}|${timestamp}||ACK^A01^ACK|ACK-${parsed.controlId}|P|2.4`;
    const ackMsa = `MSA|${status}|${parsed.controlId}${errorMsg ? `|${errorMsg}` : ''}`;

    return `${ackMsh}\r${ackMsa}`;
  }
}
