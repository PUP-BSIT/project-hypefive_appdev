<!DOCTYPE html>
<html>
<head>
    <title>Membership Accepted</title>
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
        .code {
            display: inline-block;
            padding: 15px 30px;
            margin: 20px 0;
            background-color: #f0c419;
            color: #333;
            border-radius: 60px;
            font-weight: bold;
            font-size: 18px;
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
            <img src="cid:logo.png" alt="Logo">
        </div>
        <div class="content">
            <h1>Hello, {{ $students->first_name }}!</h1>
            <p>Congratulations! Your membership request has been accepted.</p>
            <div class="footer">
                <p>Best Regards,<br>The Team</p>
            </div>
        </div>
    </div>
</body>
</html>
