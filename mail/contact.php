<?php
$to = "tarunsharmadelhi2003@gmail.com";  // replace with your email

// Collect POST data
$first_name = $_POST['first_name'] ?? $_POST['fname'] ?? '';
$email      = $_POST['email'] ?? '';
$phone      = $_POST['phone'] ?? '';
$comments   = $_POST['comments'] ?? '';

// Trim spaces
$first_name = trim($first_name);
$email      = trim($email);
$phone      = trim($phone);
$comments   = trim($comments);

// Validation
if ($first_name === '' || $email === '' || $phone === '' || $comments === '') {
    die("❌ All fields are required.");
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("❌ Invalid email format.");
}

// Build email
$mail_subject = "New Contact Form Submission - The Royal Tales";
$body = "
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {$first_name}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Phone:</strong> {$phone}</p>
    <p><strong>Message:</strong><br>{$comments}</p>
";

// Headers
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$first_name} <{$email}>\r\n";

// Send email
if (mail($to, $mail_subject, $body, $headers)) {
    // ✅ Redirect to homepage after success
    header("Location: /index.html?success=1");
    exit;
} else {
    // ❌ Redirect with error flag
    header("Location: /index.html?error=1");
    exit;
}
?>
