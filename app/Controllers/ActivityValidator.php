<?php
namespace App\Controllers;

use App\Libraries\GroqClient;

class ActivityValidator extends BaseController
{
    /**
     * Validate a given activity.
     *
     * Expects a JSON object with the following structure:
     * {
     *     "question": string,
     *     "options": array of strings,
     *     "answer": string,
     *     "correct": string
     * }
     *
     * Returns a JSON object with the following structure:
     * {
     *     "valid": boolean
     * }
     */
    public function validateactivity()
    {
        $data = $this->request->getJSON();

        // Debug: escribe los datos recibidos en los logs de CodeIgniter
        log_message('debug', 'Datos recibidos para validación: ' . json_encode($data));

        $groq = new GroqClient();
        $isValid = $groq->validateAnswer((array) $data); // Asegura que sea array
        return $this->response->setJSON(['valid' => $isValid]);
    }
}
