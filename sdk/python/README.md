# MedFlow Python SDK

```python
import requests

API_KEY = "mf_live_..."
headers = {"X-Api-Key": API_KEY}
r = requests.get("https://api.medflow.health/api/v2/patients", headers=headers)
print(r.json())
```
