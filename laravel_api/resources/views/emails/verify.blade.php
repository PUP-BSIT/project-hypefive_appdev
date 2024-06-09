<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f8f8;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
            padding: 0;
        }
        .content {
            background-color: #f0f0f0;
            padding: 5px 30px 10px 30px;
            border-radius: 10px;
        }
        .logo img {
            width: 100px;
            margin-bottom: 20px; 
        }
        .content h1 {
            color: #333;
            font-size: 24px;
            margin: 10px 0;
        }
        .content p {
            color: #666;
            font-size: 16px;
            margin: 20px 0;
        }
        .btn {
            display: inline-block;
            padding: 15px 30px;
            margin: 20px 0;
            background-color: #f0c419;
            color: #333;
            text-decoration: none;
            border-radius: 100px;
            font-weight: bold;
        }
        .btn:hover {
            background-color: #e0b417;
        }
        .note {
            color: #999;
            font-size: 14px;
            margin-top: 30px;
        }
        .footer {
            margin-top: 40px;
        }
        .footer p {
            color: #999;
            font-size: 14px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="cid:logo.png" alt="OrgBee Logo">
        </div>
        <div class="content">
            <h1>EMAIL CONFIRMATION</h1>
            <p>Almost there! Click below to confirm your email and join our organizational hive:</p>
            <a href="{{ $verificationLink }}" class="btn">Confirm Email Address</a>
            <p class="note">If you didn't sign up for this, just buzz off this email.</p>

            <div class="footer">
            <p>Best Regards,<br>The OrgBee Team</p>
            </div>

        </div>
    </div>
</body>
</html>
