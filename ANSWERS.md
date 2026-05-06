## Answers
### Security of your project:

    1. Because the endpoint is publicly exposed, unauthorized actors could discover it and submit malicious POST requests, potentially leading to database corruption or phishing risks. To mitigate this, we must implement a robust Authentication and Authorization layer. This involves requiring a valid JWT in the Request Header and performing server-side validation to ensure the user possesses the necessary Role-Based Access Control (RBAC) permissions prior to project creation.

    2. The endpoint is vulnerable to automated scripting or bot-driven spamming, which could result in thousands of project entries within seconds. This poses a risk of database bloat, escalating storage costs, and a potential Denial of Service (DoS). To mitigate this, we should implement rate-limiting middleware to restrict the frequency of requests per IP address or User ID within a defined window.

    3. The endpoint is susceptible to Mass Assignment attacks, where an actor includes unauthorized fields in the JSON payload that are not present in the UI. To prevent attackers from manipulating restricted data, we must implement strict schema validation. By explicitly defining an allow-list of fields at the backend level, we ensure that the system ignores any extraneous or unauthorized properties.

### Debugging / problem-solving your project issues:
    To diagnose the issue, I will first monitor the Network Tab to verify that the API is successfully returning a 200 or 201 status code and delivering the expected project object in the response body. If the backend is behaving correctly, I’ll audit the frontend response handler to ensure the state update logic (e.g., setProjects) is correctly integrating the new data into the UI. Finally, I’ll check the Console for any JavaScript exceptions that might be interrupting the render cycle after the data is received.

### Feedbacks:
    To implement the notification system, we will first identify the relevant API endpoints (typically POST or PATCH) and update the schema to include the necessary email fields. We’ll implement logic to compare old and new status values, triggering a background job to handle the email delivery via a chosen service provider. This ensures the application remains performant. Finally, we’ll consult the Product Owner on the email template, apply strict security validations to prevent data leaks, and implement delivery logging for tracking.

### Scope timeline: 
    We need to address the estimate discrepancy through clear, technical transparency. First, identify the missing requirement and the root cause of its omission from the initial scope. Then, present the client with a granular breakdown of the revised timeline. By clearly explaining these technical complexities, we help the client see the value in the additional work and justify the updated schedule.

### Recommendations:
    1. Enhance scannability by replacing text-based percentages with intuitive progress bars, allowing stakeholders to assess project completion at a glance.

    2. Implement a notification system that triggers updates only for major status changes, ensuring stakeholders stay informed without dashboard fatigue.

    3. Develop customized views that provide executives with high-level milestone timelines while giving developers granular visibility into blockers and dependencies.

    4. Introduce an "Estimated Time to Completion" (ETC) field to provide a nuanced view of project health, showing whether a team is trending early or late regardless of the hard deadline.

    5. Implement a 1–5 priority scoring system to ensure "High Priority" and "At Risk" projects automatically surface at the top of the dashboard.

    6. Replace generic updates with an @mention feature to directly tag individuals responsible for blockers, streamlining the resolution process.

    7. Maintain a comprehensive change log that records the "who, what, and when" of every status transition to improve accountability.

    8. Add one-click "Export to PDF/CSV" functionality to eliminate manual reporting and allow for easy external sharing.

    9. Deploy robust filtering options (Department, Lead, Priority) and a global search bar to allow users to generate specific datasets for both viewing and targeted exporting.

    10. Utilize standardized color-coded tags (e.g., Red for Urgent, Blue for Low) to allow for immediate visual categorization of the project.   