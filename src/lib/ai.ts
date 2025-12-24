export async function parseNaturalLanguage(input: string) {
    // This is a stub for the AI integration.
    // In a real implementation, you would call OpenAI or Anthropic API here.

    console.log("AI Parsing Input:", input);

    // Mock response for "Call Mom every Sunday"
    if (input.toLowerCase().includes("every sunday")) {
        return {
            title: input.replace(/ every sunday/i, ""),
            rrule: "FREQ=WEEKLY;BYDAY=SU",
            due_date: undefined // Let the system calculate next occurrence
        };
    }

    // Default fallback
    return {
        title: input,
        rrule: undefined,
        due_date: new Date().toISOString()
    };
}
