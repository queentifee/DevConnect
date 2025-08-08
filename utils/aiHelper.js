const axios = require ('axios');

exports.askAssistant = async (prompt) => {
    try {
        const response = await axios.post ('http://localhost:11434/api/generate', {
            model:'llama3',
            prompt: prompt,
            stream: false
        });
        return response.data.response;
    } catch (error) {
        console.error('AI Error:', error.message);
    return 'Sorry, there was a problem processing your request.';
        
    }
}