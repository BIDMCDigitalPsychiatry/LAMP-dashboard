
/**
 * The ActivitySpec determines the parameters and properties of an Activity and its corresponding generated ResultEvents.
 */
export class ActivitySpec {
    
    /**
     * The name of the activity spec.
     */
    name?: string
    
    /**
     * Either a binary blob containing a document or video, or a string containing instructional aid about the Activity.
     */
    helpContents?: string
    
    /**
     * The WebView-compatible script that provides this Activity on mobile or desktop (IFrame) clients.
     */
    scriptContents?: string
    
    /**
     * The static data definition of an ActivitySpec.
     */
    staticDataSchema?: any
    
    /**
     * The temporal event data definition of an ActivitySpec.
     */
    temporalEventSchema?: any
    
    /**
     * The Activity settings definition of an ActivitySpec.
     */
    settingsSchema?: any
}
