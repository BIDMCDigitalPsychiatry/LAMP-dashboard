# LAMP Dashboard

[To learn more about the LAMP Platform, visit our documentation.](https://docs.lamp.digital/)


## Local development
1. Run `npm install`
2. Make sure that the server you plan on using during development accepts the url of the local dashboard server as 
an allowed cors origin.
3. Start the server:

    If you are using the dashboard to connect to a LAMP-server running locally run: `npm run dev`
    This will cause the dashboard to make requests to the LAMP-server over http instead of https.
    
    If you are using the dashboard to connect to a LAMP-server running elsewhere, or one that is running locally with https enabled run: `npm start`.

