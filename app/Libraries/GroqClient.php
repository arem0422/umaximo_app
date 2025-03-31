<?php
namespace App\Libraries;

class GroqClient
{
    protected $apiKey;

    /**
     * Constructor for the GroqClient class.
     *
     * Initializes the GroqClient instance by setting the API key
     * from the environment variable 'GROQ_API_KEY'.
     */

    public function __construct()
    {
        $this->apiKey = getenv('GROQ_API_KEY');
    }


    /**
     * Generates a random math activity.
     *
     * The activity is a linear equation in the form of ax + b = c, where
     * a and b are random numbers between 1 and 10, and c is the result of the equation.
     * The correct answer is the value of x.
     *
     * The method returns an array containing the question, the correct answer, and 3 random fake answers.
     *
     * @return array
     */
    public function generateMathActivity(): array
    {
        $prompt = <<<PROMPT
    Genera una pregunta de matemáticas para un niño de 10 años basada en una ecuación con una incógnita (en los números naturales), usando un contexto amigable como Mario, Sonic, Pokémon, Peppa Pig, Minecraft u otros.

    Devuelve el resultado estrictamente en formato JSON, sin etiquetas Markdown, sin explicaciones, como esto:

    {
    "question": "¿Cuál es el valor de x si Sonic tiene 5x anillos y luego encuentra 2 más, y ahora tiene 27 anillos?",
    "options": ["5", "6", "7", "8"],
    "answer": "5"
    }
    PROMPT;

        $url = "https://api.groq.com/openai/v1/chat/completions";

        $data = [
            "model" => "llama-3.3-70b-versatile",
            "messages" => [
                ["role" => "user", "content" => $prompt]
            ],
            "temperature" => 0.8
        ];

        $headers = [
            "Content-Type: application/json",
            "Authorization: Bearer {$this->apiKey}"
        ];

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => $headers,
        ]);

        $response = curl_exec($curl);
        $error = curl_error($curl);
        curl_close($curl);

        if ($error) {
            log_message('error', "Groq API error: $error");
            return [
                'question' => 'No se pudo generar la pregunta',
                'options' => ['1', '2', '3', '4'],
                'answer' => '1'
            ];
        }

        $responseData = json_decode($response, true);
        $content = $responseData['choices'][0]['message']['content'] ?? '';

        // Limpiar etiquetas tipo Markdown si existen
        $cleaned = preg_replace('/```json|```/', '', $content);
        $cleaned = trim($cleaned);
        $json = json_decode($cleaned, true);

        if (!$json || !isset($json['question'], $json['options'], $json['answer'])) {
            log_message('error', "Respuesta Groq inválida: " . $content);
            return [
                'question' => 'Error en la respuesta de la IA',
                'options' => ['1', '2', '3', '4'],
                'answer' => '1'
            ];
        }

        return [
            'question' => $json['question'],
            'options' => $json['options'],
            'answer' => $json['answer']
        ];
    }




    /**
     * Validates a given answer for a given activity.
     *
     * Checks that the given activity array has both 'answer' and 'correct' keys,
     * and that the value of 'answer' is equal to the value of 'correct'.
     *
     * @param array $activity The activity to validate, containing 'question',
     *                        'options', 'answer', and 'correct' keys.
     *
     * @return bool True if the answer is valid, false otherwise.
     */
    public function validateAnswer(array $activity): bool
    {
        return isset($activity['answer'], $activity['correct']) && $activity['answer'] === $activity['correct'];
    }
}
