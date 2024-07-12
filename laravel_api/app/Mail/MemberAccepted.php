<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class MemberAccepted extends Mailable
{
    use Queueable, SerializesModels;

    public $students;
    public $statusMessage;
    public $redirectLink;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($students, $statusMessage, $redirectLink)
    {
        $this->students = $students;
        $this->statusMessage = $statusMessage;
        $this->redirectLink = $redirectLink;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $imagePath = public_path('storage/images/logo.png');
        $imageData = file_get_contents($imagePath);
        $imageMimeType = mime_content_type($imagePath);

        return $this->view('emails.memberAccepted')
                    ->subject('Membership Status Update')
                    ->with([
                        'students' => $this->students,
                        'statusMessage' => $this->statusMessage,
                        'redirectLink' => $this->redirectLink
                    ])
                    ->attachData($imageData, 'logo.png', ['mime' => $imageMimeType]);
    }
}
