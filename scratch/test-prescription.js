async function test() {
  try {
    // We need to use the token the user has. 
    // I can just read it from the user's debug report!
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvY3RvckBjbGluaWMuY29tIiwic3ViIjoiNTk0NmI2OTQtZWY3ZC00ZTc0LThkNTYtNWJjMjdlMWFmZTI3Iiwicm9sZSI6IkRPQ1RPUiIsInByaW1hcnlCcmFuY2hJZCI6IjFiNTZhYzViLWMxYWMtNDhiOC05MzI5LWVhNzEwZTU3NzQyYSIsImJyYW5jaEFjY2VzcyI6WyIxYjU2YWM1Yi1jMWFjLTQ4YjgtOTMyOS1lYTcxMGU1Nzc0MmEiXSwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE3ODM0MTcyMDcsImV4cCI6MTc4MzUwMzYwN30.bo1EwUtTNpcCYUlRvqC8ftLymeKsJk1Nmo9-u9nqer4";
    
    const payload = {
      "items": [
        {
          "simpleDrugId": "4d174f2c-6e66-4aac-b7d5-1c17fad27019",
          "drugName": "Bandage - Variant 25",
          "dosage": "5 ml",
          "frequency": "1-0-1",
          "duration": 5,
          "instructions": "With Warm Water",
          "route": "Oral",
          "isSimpleDrug": true,
          "unitCost": 0,
          "totalQuantity": 10
        }
      ],
      "notes": ""
    };

    const res = await fetch('http://localhost:3001/api/consultation/dd01fff0-1c82-4f78-a8ad-0458533c2dd5/prescriptions', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-branch-id': '1b56ac5b-c1ac-48b8-9329-ea710e57742a',
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log("Success:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
