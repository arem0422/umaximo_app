<?php
namespace App\Controllers;

use App\Libraries\GroqClient;

class ActivityGenerator extends BaseController
{
    public function generate()
    {
        $groq = new GroqClient();
        $activity = $groq->generateMathActivity();
        return $this->response->setJSON($activity);
    }
}
