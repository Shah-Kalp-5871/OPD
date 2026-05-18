# MedFlow Java SDK

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.medflow.health/api/v2/patients"))
    .header("X-Api-Key", apiKey)
    .GET()
    .build();
```
