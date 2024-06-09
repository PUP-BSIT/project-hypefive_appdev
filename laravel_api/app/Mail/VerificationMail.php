<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class VerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $verificationLink;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($verificationLink)
    {
        $this->verificationLink = $verificationLink;
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
    
        return $this->view('emails.verify')
                    ->subject('Email Verification')
                    ->with(['verificationLink' => $this->verificationLink])
                    ->attachData($imageData, 'logo.png', ['mime' => $imageMimeType]);
    }
    
}
