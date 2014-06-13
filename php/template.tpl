<html>
<head>
  <style>
    body {
      font-family: 'HelveticaNeue-Light', 'Helvetica', sans-serif;
      font-weight: 300;
      font-size: 12px;
      color: #757F90;
    }
    h2 {
      color: #757F90;
      font-size: 18px;
      margin: 0 0 10px 0;
      font-weight: 100;
    }
    p {
      font-size: 14px;
      line-height: 1.6em;
      color: #757F90;
      text-align: left;
      margin: 0 0 20px 0;
    }
    .container {
      margin: 8%;
    }
    hr {
      height: 1px;
      background: #ddd;
      border: none;
    }
    b {
      font-weight: 600;
    }
    a {
      color: #757F90;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .footer {
      color: #ddd;
      line-height: 1.3em;
      font-size: 10px;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="container">
    <p>Mail received at <?php echo date("F j, Y, g:i a"); ?></p>

    <h2>Keep me posted</h2>

    <p>
      <b>E-Mail:</b> <?php echo $email; ?>
    </p>

    <hr/>

    <p class="footer">
      population.io
    </p>
  </div>
</body>
</html>
