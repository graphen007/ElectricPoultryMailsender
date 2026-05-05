export function getDanishEmailHtml(recipientName: string): string {
  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Open+Sans:ital,wght@0,400;0,600;1,400&display=swap');
    body{margin:0;padding:0;background:#0a0a0a;}
    .wrap{background:#0a0a0a;padding:32px 16px;}
    .card{max-width:600px;margin:0 auto;background:#0f0f0f;border:1px solid #1e1e1e;}
    .hdr{
      background:linear-gradient(170deg,#060202 0%,#1e0a07 35%,#471812 70%,#7b2920 100%);
      padding:48px 44px 42px;
      text-align:center;
    }
    .hdr h1{
      font-family:'Oswald',sans-serif;
      font-size:38px;
      font-weight:700;
      color:#fff;
      margin:0 0 14px;
      letter-spacing:8px;
      text-transform:uppercase;
    }
    .hdr-rule{width:32px;height:2px;background:#ffd600;margin:0 auto 12px;}
    .hdr-sub{
      font-family:'Oswald',sans-serif;
      font-size:10px;
      color:rgba(255,214,0,0.55);
      letter-spacing:4px;
      text-transform:uppercase;
    }
    .body{
      padding:40px 44px;
      font-family:'Open Sans',Arial,sans-serif;
      font-size:15px;
      line-height:1.85;
      color:#c0c0c0;
    }
    p{margin:0 0 18px;}
    .quote{
      font-style:italic;
      color:#aaa;
      border-left:2px solid #7b2920;
      padding:4px 0 4px 18px;
      margin:0 0 18px;
      font-size:15px;
    }
    hr{border:none;border-top:1px solid #1e1e1e;margin:28px 0;}
    .row{display:flex;gap:14px;align-items:baseline;margin-bottom:10px;}
    .lbl{
      font-family:'Oswald',sans-serif;
      font-size:10px;
      color:rgba(255,214,0,0.7);
      letter-spacing:2.5px;
      text-transform:uppercase;
      min-width:80px;
      flex-shrink:0;
    }
    .val{color:#aaa;font-size:14px;}
    .links{margin:26px 0 4px;}
    .links a{
      display:block;
      color:#ffd600;
      text-decoration:none;
      font-size:14px;
      margin-bottom:8px;
      opacity:0.8;
    }
    .tagline{
      font-family:'Oswald',sans-serif;
      font-size:14px;
      color:rgba(255,214,0,0.45);
      letter-spacing:6px;
      text-transform:uppercase;
      text-align:center;
      margin:36px 0 30px;
    }
    .sig{border-top:1px solid #1e1e1e;padding-top:24px;}
    .sig-name{color:#e0e0e0;font-weight:600;font-size:15px;margin:0 0 2px;}
    .sig-role{color:#505050;font-size:13px;margin:0 0 14px;}
    .sig-detail{color:#555;font-size:13px;margin:3px 0;}
    .sig-detail a{color:rgba(255,214,0,0.7);text-decoration:none;}
    .ftr{
      background:#060202;
      border-top:1px solid #180806;
      padding:14px 44px;
      text-align:center;
    }
    .ftr p{
      font-family:'Oswald',sans-serif;
      color:#271008;
      font-size:10px;
      margin:0;
      letter-spacing:3px;
      text-transform:uppercase;
    }
  </style>
</head>
<body>
<div class="wrap"><div class="card">

  <div class="hdr">
    <h1>Electric Poultry</h1>
    <div class="hdr-rule"></div>
    <div class="hdr-sub">70's Hard Rock &nbsp;&middot;&nbsp; Aarhus</div>
  </div>

  <div class="body">
    <p>Hej ${recipientName},</p>

    <p>Vi er Electric Poultry &mdash; fire gutter fra Aarhus der spiller hård, riff-tung rock med rod i 70'erne. Vi vil gerne spille for jer.</p>

    <p>Vores udgangspunkt er Black Sabbath og den tidlige hårde rock, men vi blander funk, grunge og metal ind &mdash; ikke for at forvirre, men fordi det er der musikken fører os hen. Lyden er tung, melodierne er der, og det er til at danse til. Vi tager ikke os selv for seriøst, men vi spiller på et seriøst niveau, og folk mærker det.</p>

    <p>Vi vandt publikumsprisen ved Von Hatten prisen 2025. Michael Gonzalez fra Værket/Turbinen sagde det rimelig godt:</p>

    <p class="quote">"I var pissefantastiske i lørdags, og jeg er helt klart fan."</p>

    <p>En fyr fra danseorkestret spurgte om vi havde indspillet noget &mdash; det havde vi ikke lignet. Men vi arbejder på det.</p>

    <hr>

    <div class="row"><span class="lbl">Spilletid</span><span class="val">30&ndash;60 min &mdash; 45 min original materiale</span></div>
    <div class="row"><span class="lbl">Honorar</span><span class="val">Vi spiller gratis &mdash; transport til stedet er en hjælp</span></div>

    <hr>

    <div class="links">
      <a href="https://open.spotify.com/artist/5gi4QURA7lFaeZx6ZUDy7O">Spotify</a>
      <a href="https://www.youtube.com/watch?v=Cwd0dJyLQDU">Promo video</a>
      <a href="https://www.youtube.com/watch?v=fbnGbQo9Xf4">En bette koncert</a>
      <a href="https://electricpoultry.com/">electricpoultry.com</a>
    </div>

    <div class="tagline">Fear the Chicken.</div>

    <div class="sig">
      <p class="sig-name">Mikkel Petersen</p>
      <p class="sig-role">Forsanger &amp; Rytme guitarist &mdash; Electric Poultry</p>
      <div class="sig-detail">+45 61 45 86 06</div>
      <div class="sig-detail"><a href="mailto:ElectricPoultry@gmail.com">ElectricPoultry@gmail.com</a></div>
      <div class="sig-detail"><a href="https://www.instagram.com/electricpoultry/">Instagram</a> &nbsp;&middot;&nbsp; <a href="https://www.facebook.com/profile.php?id=61579206054166">Facebook</a></div>
    </div>
  </div>

  <div class="ftr"><p>Electric Poultry &middot; Aarhus</p></div>
</div></div>
</body>
</html>`;
}

export function getEnglishEmailHtml(recipientName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Open+Sans:ital,wght@0,400;0,600;1,400&display=swap');
    body{margin:0;padding:0;background:#0a0a0a;}
    .wrap{background:#0a0a0a;padding:32px 16px;}
    .card{max-width:600px;margin:0 auto;background:#0f0f0f;border:1px solid #1e1e1e;}
    .hdr{background:linear-gradient(170deg,#060202 0%,#1e0a07 35%,#471812 70%,#7b2920 100%);padding:48px 44px 42px;text-align:center;}
    .hdr h1{font-family:'Oswald',sans-serif;font-size:38px;font-weight:700;color:#fff;margin:0 0 14px;letter-spacing:8px;text-transform:uppercase;}
    .hdr-rule{width:32px;height:2px;background:#ffd600;margin:0 auto 12px;}
    .hdr-sub{font-family:'Oswald',sans-serif;font-size:10px;color:rgba(255,214,0,0.55);letter-spacing:4px;text-transform:uppercase;}
    .body{padding:40px 44px;font-family:'Open Sans',Arial,sans-serif;font-size:15px;line-height:1.85;color:#c0c0c0;}
    p{margin:0 0 18px;}
    .quote{font-style:italic;color:#aaa;border-left:2px solid #7b2920;padding:4px 0 4px 18px;margin:0 0 18px;font-size:15px;}
    hr{border:none;border-top:1px solid #1e1e1e;margin:28px 0;}
    .row{display:flex;gap:14px;align-items:baseline;margin-bottom:10px;}
    .lbl{font-family:'Oswald',sans-serif;font-size:10px;color:rgba(255,214,0,0.7);letter-spacing:2.5px;text-transform:uppercase;min-width:80px;flex-shrink:0;}
    .val{color:#aaa;font-size:14px;}
    .links{margin:26px 0 4px;}
    .links a{display:block;color:#ffd600;text-decoration:none;font-size:14px;margin-bottom:8px;opacity:0.8;}
    .tagline{font-family:'Oswald',sans-serif;font-size:14px;color:rgba(255,214,0,0.45);letter-spacing:6px;text-transform:uppercase;text-align:center;margin:36px 0 30px;}
    .sig{border-top:1px solid #1e1e1e;padding-top:24px;}
    .sig-name{color:#e0e0e0;font-weight:600;font-size:15px;margin:0 0 2px;}
    .sig-role{color:#505050;font-size:13px;margin:0 0 14px;}
    .sig-detail{color:#555;font-size:13px;margin:3px 0;}
    .sig-detail a{color:rgba(255,214,0,0.7);text-decoration:none;}
    .ftr{background:#060202;border-top:1px solid #180806;padding:14px 44px;text-align:center;}
    .ftr p{font-family:'Oswald',sans-serif;color:#271008;font-size:10px;margin:0;letter-spacing:3px;text-transform:uppercase;}
  </style>
</head>
<body>
<div class="wrap"><div class="card">

  <div class="hdr">
    <h1>Electric Poultry</h1>
    <div class="hdr-rule"></div>
    <div class="hdr-sub">70's Hard Rock &nbsp;&middot;&nbsp; Aarhus, Denmark</div>
  </div>

  <div class="body">
    <p>Hi ${recipientName},</p>

    <p>We are Electric Poultry &mdash; four guys from Aarhus playing heavy, riff-driven rock rooted in the 70's. We'd love to play at your venue.</p>

    <p>We start with Black Sabbath and the early heavy stuff, then pull in funk, grunge and metal &mdash; not to confuse people, but because that's where the music takes us. It's heavy, it's melodic, and people actually move to it. We don't take ourselves too seriously, but we play at a serious level, and audiences feel it.</p>

    <p>We won the audience award at Von Hatten prisen 2025. Michael Gonzalez from Værket/Turbinen said it pretty well:</p>

    <p class="quote">"You were absolutely incredible on Saturday &mdash; I am definitely a fan."</p>

    <p>A musician from the Danish National Orchestra asked if we had anything recorded. We didn't look like that kind of band. But we're working on it.</p>

    <hr>

    <div class="row"><span class="lbl">Set length</span><span class="val">30&ndash;60 min &mdash; 45 min original material</span></div>
    <div class="row"><span class="lbl">Fee</span><span class="val">We play for free &mdash; covering transport to the venue is appreciated</span></div>

    <hr>

    <div class="links">
      <a href="https://open.spotify.com/artist/5gi4QURA7lFaeZx6ZUDy7O">Spotify</a>
      <a href="https://www.youtube.com/watch?v=Cwd0dJyLQDU">Promo video</a>
      <a href="https://www.youtube.com/watch?v=fbnGbQo9Xf4">A small show</a>
      <a href="https://electricpoultry.com/">electricpoultry.com</a>
    </div>

    <div class="tagline">Fear the Chicken.</div>

    <div class="sig">
      <p class="sig-name">Mikkel Petersen</p>
      <p class="sig-role">Vocals &amp; Rhythm Guitar &mdash; Electric Poultry</p>
      <div class="sig-detail">+45 61 45 86 06</div>
      <div class="sig-detail"><a href="mailto:ElectricPoultry@gmail.com">ElectricPoultry@gmail.com</a></div>
      <div class="sig-detail"><a href="https://www.instagram.com/electricpoultry/">Instagram</a> &nbsp;&middot;&nbsp; <a href="https://www.facebook.com/profile.php?id=61579206054166">Facebook</a></div>
    </div>
  </div>

  <div class="ftr"><p>Electric Poultry &middot; Aarhus</p></div>
</div></div>
</body>
</html>`;
}

export function getDanishEmailText(recipientName: string): string {
  return `Hej ${recipientName},

Vi er Electric Poultry - fire gutter fra Aarhus der spiller hård, riff-tung rock med rod i 70'erne. Vi vil gerne spille for jer.

Vores udgangspunkt er Black Sabbath og den tidlige hårde rock, men vi blander funk, grunge og metal ind. Lyden er tung, melodierne er der, og det er til at danse til. Vi tager ikke os selv for seriøst, men vi spiller på et seriøst niveau, og folk mærker det.

Vi vandt publikumsprisen ved Von Hatten prisen 2025. Michael Gonzalez fra Værket/Turbinen sagde:

"I var pissefantastiske i lørdags, og jeg er helt klart fan."

En fyr fra danseorkestret spurgte om vi havde indspillet noget - det havde vi ikke lignet.

---

Spilletid: 30-60 min (45 min original materiale)
Honorar: Vi spiller gratis - transport til stedet er en hjælp

---

Spotify: https://open.spotify.com/artist/5gi4QURA7lFaeZx6ZUDy7O
Promo video: https://www.youtube.com/watch?v=Cwd0dJyLQDU
En bette koncert: https://www.youtube.com/watch?v=fbnGbQo9Xf4
Hjemmeside: https://electricpoultry.com/

Fear the Chicken.

Mikkel Petersen
Forsanger & Rytme guitarist - Electric Poultry
+45 61 45 86 06
ElectricPoultry@gmail.com`;
}

export function getEnglishEmailText(recipientName: string): string {
  return `Hi ${recipientName},

We are Electric Poultry - four guys from Aarhus playing heavy, riff-driven rock rooted in the 70's. We'd love to play at your venue.

We start with Black Sabbath and the early heavy stuff, then pull in funk, grunge and metal. It's heavy, melodic, and people actually move to it. We don't take ourselves too seriously, but we play at a serious level.

We won the audience award at Von Hatten prisen 2025. Michael Gonzalez from Vaerket/Turbinen put it well:

"You were absolutely incredible on Saturday - I am definitely a fan."

A musician from the Danish National Orchestra asked if we had anything recorded. We didn't look like that kind of band. But we're working on it.

---

Set length: 30-60 min (45 min original material)
Fee: We play for free - covering transport to the venue is appreciated

---

Spotify: https://open.spotify.com/artist/5gi4QURA7lFaeZx6ZUDy7O
Promo video: https://www.youtube.com/watch?v=Cwd0dJyLQDU
A small show: https://www.youtube.com/watch?v=fbnGbQo9Xf4
Website: https://electricpoultry.com/

Fear the Chicken.

Mikkel Petersen
Vocals & Rhythm Guitar - Electric Poultry
+45 61 45 86 06
ElectricPoultry@gmail.com`;
}

// ─── Mothem collaboration templates ─────────────────────────────────────────

const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Open+Sans:ital,wght@0,400;0,600;1,400&display=swap');
    body{margin:0;padding:0;background:#0a0a0a;}
    .wrap{background:#0a0a0a;padding:32px 16px;}
    .card{max-width:600px;margin:0 auto;background:#0f0f0f;border:1px solid #1e1e1e;}
    .hdr{background:linear-gradient(170deg,#060202 0%,#1e0a07 35%,#471812 70%,#7b2920 100%);padding:48px 44px 42px;text-align:center;}
    .hdr h1{font-family:'Oswald',sans-serif;font-size:32px;font-weight:700;color:#fff;margin:0 0 6px;letter-spacing:6px;text-transform:uppercase;}
    .hdr-rule{width:32px;height:2px;background:#ffd600;margin:6px auto;}
    .hdr-sub{font-family:'Oswald',sans-serif;font-size:10px;color:rgba(255,214,0,0.55);letter-spacing:4px;text-transform:uppercase;}
    .body{padding:40px 44px;font-family:'Open Sans',Arial,sans-serif;font-size:15px;line-height:1.85;color:#c0c0c0;}
    p{margin:0 0 18px;}
    .quote{font-style:italic;color:#aaa;border-left:2px solid #7b2920;padding:4px 0 4px 18px;margin:0 0 18px;font-size:15px;}
    .box{background:#141414;border:1px solid #222;padding:18px 22px;margin:20px 0;}
    .box-title{font-family:'Oswald',sans-serif;font-size:11px;color:rgba(255,214,0,0.7);letter-spacing:3px;text-transform:uppercase;margin:0 0 10px;}
    hr{border:none;border-top:1px solid #1e1e1e;margin:28px 0;}
    .row{display:flex;gap:14px;align-items:baseline;margin-bottom:10px;}
    .lbl{font-family:'Oswald',sans-serif;font-size:10px;color:rgba(255,214,0,0.7);letter-spacing:2.5px;text-transform:uppercase;min-width:80px;flex-shrink:0;}
    .val{color:#aaa;font-size:14px;}
    .links{margin:26px 0 4px;}
    .links a{display:block;color:#ffd600;text-decoration:none;font-size:14px;margin-bottom:8px;opacity:0.8;}
    .tagline{font-family:'Oswald',sans-serif;font-size:14px;color:rgba(255,214,0,0.45);letter-spacing:6px;text-transform:uppercase;text-align:center;margin:36px 0 30px;}
    .sig{border-top:1px solid #1e1e1e;padding-top:24px;}
    .sig-name{color:#e0e0e0;font-weight:600;font-size:15px;margin:0 0 2px;}
    .sig-role{color:#505050;font-size:13px;margin:0 0 14px;}
    .sig-detail{color:#555;font-size:13px;margin:3px 0;}
    .sig-detail a{color:rgba(255,214,0,0.7);text-decoration:none;}
    .ftr{background:#060202;border-top:1px solid #180806;padding:14px 44px;text-align:center;}
    .ftr p{font-family:'Oswald',sans-serif;color:#271008;font-size:10px;margin:0;letter-spacing:3px;text-transform:uppercase;}
`;

export function getDanishMothemEmailHtml(recipientName: string): string {
  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>${sharedStyles}</style>
</head>
<body>
<div class="wrap"><div class="card">

  <div class="hdr">
    <h1>Electric Poultry</h1>
    <div class="hdr-rule"></div>
    <div class="hdr-sub">+ Mothem &nbsp;&middot;&nbsp; To bands &middot; &Eacute;n aften</div>
  </div>

  <div class="body">
    <p>Hej ${recipientName},</p>

    <p>Vi er Electric Poultry &mdash; fire gutter fra Aarhus der spiller hård, riff-tung rock med rod i 70'erne. Vi vil gerne spille for jer, og vi har et forslag til jer.</p>

    <p>Vi spiller gerne alene &mdash; 45 minutter original materiale, gratis, transport til stedet er en hjælp. Men vi har også mulighed for at gøre aftenen til noget større.</p>

    <div class="box">
      <div class="box-title">Option: En fuld aften med Mothem</div>
      <p style="margin:0;font-size:14px;color:#aaa;">Vi har et godt samarbejde med <strong style="color:#e0e0e0;">Mothem</strong> &mdash; et Københavnsk hard rock/metal band med et moderne, teatralsk sound. De udgav debut-albummet <em>State of Decay</em> i 2025 og trækker på Alter Bridge-vibes med tunge riffs og melodiske kroge. De har 45 minutters eget materiale. Tilsammen kan vi dække en hel aften med to meget forskellige men komplementære bud på hård rock.</p>
    </div>

    <p>Med andre ord: I kan få én koncert, eller I kan få to.</p>

    <p>Vi vandt publikumsprisen ved Von Hatten prisen 2025. Michael Gonzalez fra Værket/Turbinen sagde det rimelig godt:</p>

    <p class="quote">"I var pissefantastiske i lørdags, og jeg er helt klart fan."</p>

    <hr>

    <div class="row"><span class="lbl">EP spilletid</span><span class="val">45 min original materiale</span></div>
    <div class="row"><span class="lbl">Mothem</span><span class="val">45 min original materiale</span></div>
    <div class="row"><span class="lbl">Honorar</span><span class="val">Vi spiller gratis &mdash; transport til stedet er en hjælp</span></div>

    <hr>

    <div class="links">
      <a href="https://open.spotify.com/artist/5gi4QURA7lFaeZx6ZUDy7O">Electric Poultry &mdash; Spotify</a>
      <a href="https://www.youtube.com/watch?v=Cwd0dJyLQDU">Electric Poultry &mdash; Promo video</a>
      <a href="https://open.spotify.com/artist/5buAJawfbj8tFVTAu5Jzq9">Mothem &mdash; Spotify</a>
      <a href="https://mothem.dk">mothem.dk</a>
      <a href="https://electricpoultry.com/">electricpoultry.com</a>
    </div>

    <div class="tagline">Fear the Chicken.</div>

    <div class="sig">
      <p class="sig-name">Mikkel Petersen</p>
      <p class="sig-role">Forsanger &amp; Rytme guitarist &mdash; Electric Poultry</p>
      <div class="sig-detail">+45 61 45 86 06</div>
      <div class="sig-detail"><a href="mailto:ElectricPoultry@gmail.com">ElectricPoultry@gmail.com</a></div>
      <div class="sig-detail"><a href="https://www.instagram.com/electricpoultry/">Instagram</a> &nbsp;&middot;&nbsp; <a href="https://www.facebook.com/profile.php?id=61579206054166">Facebook</a></div>
    </div>
  </div>

  <div class="ftr"><p>Electric Poultry &amp; Mothem &middot; Aarhus / K&oslash;benhavn</p></div>
</div></div>
</body>
</html>`;
}

export function getEnglishMothemEmailHtml(recipientName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>${sharedStyles}</style>
</head>
<body>
<div class="wrap"><div class="card">

  <div class="hdr">
    <h1>Electric Poultry</h1>
    <div class="hdr-rule"></div>
    <div class="hdr-sub">+ Mothem &nbsp;&middot;&nbsp; Two bands &middot; One night</div>
  </div>

  <div class="body">
    <p>Hi ${recipientName},</p>

    <p>We are Electric Poultry &mdash; four guys from Aarhus playing heavy, riff-driven rock rooted in the 70's. We'd love to play at your venue, and we have a proposition for you.</p>

    <p>We're happy to play solo &mdash; 45 minutes of original material, no fee, just help with transport. But we also have the option to make it a fuller evening.</p>

    <div class="box">
      <div class="box-title">Option: A full night with Mothem</div>
      <p style="margin:0;font-size:14px;color:#aaa;">We have a good relationship with <strong style="color:#e0e0e0;">Mothem</strong> &mdash; a Copenhagen hard rock/metal band with a modern, theatrical sound. They released their debut album <em>State of Decay</em> in 2025 and draw comparisons to Alter Bridge: heavy riffs, melodic hooks, and a dark, dystopian edge. They also have 45 minutes of original material. Together, we cover a full evening &mdash; two very different but complementary takes on heavy rock.</p>
    </div>

    <p>In short: you can book one band, or you can book two.</p>

    <p>We won the audience award at Von Hatten prisen 2025. Michael Gonzalez from V&aelig;rket/Turbinen put it well:</p>

    <p class="quote">"You were absolutely incredible on Saturday &mdash; I am definitely a fan."</p>

    <hr>

    <div class="row"><span class="lbl">EP set</span><span class="val">45 min original material</span></div>
    <div class="row"><span class="lbl">Mothem</span><span class="val">45 min original material</span></div>
    <div class="row"><span class="lbl">Fee</span><span class="val">We play for free &mdash; covering transport to the venue is appreciated</span></div>

    <hr>

    <div class="links">
      <a href="https://open.spotify.com/artist/5gi4QURA7lFaeZx6ZUDy7O">Electric Poultry &mdash; Spotify</a>
      <a href="https://www.youtube.com/watch?v=Cwd0dJyLQDU">Electric Poultry &mdash; Promo video</a>
      <a href="https://open.spotify.com/artist/5buAJawfbj8tFVTAu5Jzq9">Mothem &mdash; Spotify</a>
      <a href="https://mothem.dk">mothem.dk</a>
      <a href="https://electricpoultry.com/">electricpoultry.com</a>
    </div>

    <div class="tagline">Fear the Chicken.</div>

    <div class="sig">
      <p class="sig-name">Mikkel Petersen</p>
      <p class="sig-role">Vocals &amp; Rhythm Guitar &mdash; Electric Poultry</p>
      <div class="sig-detail">+45 61 45 86 06</div>
      <div class="sig-detail"><a href="mailto:ElectricPoultry@gmail.com">ElectricPoultry@gmail.com</a></div>
      <div class="sig-detail"><a href="https://www.instagram.com/electricpoultry/">Instagram</a> &nbsp;&middot;&nbsp; <a href="https://www.facebook.com/profile.php?id=61579206054166">Facebook</a></div>
    </div>
  </div>

  <div class="ftr"><p>Electric Poultry &amp; Mothem &middot; Aarhus / Copenhagen</p></div>
</div></div>
</body>
</html>`;
}

export function getDanishMothemEmailText(recipientName: string): string {
  return `Hej ${recipientName},

Vi er Electric Poultry - fire gutter fra Aarhus der spiller hård, riff-tung rock med rod i 70'erne. Vi vil gerne spille for jer - og vi har et forslag.

Vi spiller gerne alene (45 min, gratis, hjælp til transport), men vi har også mulighed for noget større.

--- Option: En fuld aften med Mothem ---

Mothem er et Københavnsk hard rock/metal band der udgav debut-albummet "State of Decay" i 2025. Moderne, teatralsk sound med Alter Bridge-vibes - tunge riffs og melodiske kroge. De har 45 min eget materiale. Tilsammen kan vi dække en hel aften med to bud på hård rock.

---

Electric Poultry spilletid: 45 min
Mothem spilletid: 45 min
Honorar: Gratis - transport til stedet er en hjælp

---

Vi vandt publikumsprisen ved Von Hatten prisen 2025.

Electric Poultry Spotify: https://open.spotify.com/artist/5gi4QURA7lFaeZx6ZUDy7O
Electric Poultry promo: https://www.youtube.com/watch?v=Cwd0dJyLQDU
Mothem Spotify: https://open.spotify.com/artist/5buAJawfbj8tFVTAu5Jzq9
mothem.dk: https://mothem.dk
electricpoultry.com: https://electricpoultry.com/

Fear the Chicken.

Mikkel Petersen
Forsanger & Rytme guitarist - Electric Poultry
+45 61 45 86 06
ElectricPoultry@gmail.com`;
}

export function getEnglishMothemEmailText(recipientName: string): string {
  return `Hi ${recipientName},

We are Electric Poultry - four guys from Aarhus playing heavy, riff-driven rock rooted in the 70's. We'd love to play at your venue - and we have a proposition.

We're happy to play solo (45 min, no fee, just transport), but we also have the option to make it a fuller evening.

--- Option: A full night with Mothem ---

Mothem is a Copenhagen hard rock/metal band that released their debut album "State of Decay" in 2025. Modern, theatrical sound with Alter Bridge comparisons - heavy riffs, melodic hooks, dark edge. They have 45 min of original material. Together we cover a full evening with two takes on heavy rock.

---

Electric Poultry set: 45 min
Mothem set: 45 min
Fee: Free - covering transport to the venue is appreciated

---

We won the audience award at Von Hatten prisen 2025.

Electric Poultry Spotify: https://open.spotify.com/artist/5gi4QURA7lFaeZx6ZUDy7O
Electric Poultry promo: https://www.youtube.com/watch?v=Cwd0dJyLQDU
Mothem Spotify: https://open.spotify.com/artist/5buAJawfbj8tFVTAu5Jzq9
mothem.dk: https://mothem.dk
electricpoultry.com: https://electricpoultry.com/

Fear the Chicken.

Mikkel Petersen
Vocals & Rhythm Guitar - Electric Poultry
+45 61 45 86 06
ElectricPoultry@gmail.com`;
}
