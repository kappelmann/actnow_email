# actnow.email

A frontend to create email templates and share them with others via
standard browser or mailto links.
It also supports contact data backends.
An example of the template creator can be found on [actnow.email](https://actnow.email)
and an example integration of backend data on [actnow.email/meps](https://actnow.email/meps).

The app uses [sql.js](https://sql.js.org/#/):
contact databases are fetched from a server
but all queries are run locally.
This makes the service easy to host as no database backend
service needs to be deployed.

**Features**:

1. Create email templates
2. Quickly share templates via URL, QR code, or social media integration
3. Supports contact data backends
4. Multi-language support

## Building

1. You need to install [npm](https://docs.npmjs.com/cli/v7/configuring-npm/install).
2. Clone and navigate into this repository
3. Run `git submodule sync` and `git submodule update` to initialise the git submodules
4. Run `npm install` to install the npm dependencies
5. (optional) Run `./update_db.sh` to scrape and build the backend data
6. Build the app `npm run build`. Files will be put into `dist/`.
7. Run the app on a local webserver by running `npm run start`.

### URL shortener

The default setup creates short links using https://actnow.link.
Said service is powered by [YOURLS](https://yourls.org/).
You may change the service by replacing the corresponding URLs in `src/consts/urls.ts`
and updating the client `src/shortLinkClient.ts` and the corresponding client calls in other files.

If you also decide to use YOURLS, then note that an initial credential retrival call to
`credentials.php` is made,
the content of which is as follows:
```php
<?php
$signature_token = <ADD_TOKEN_HERE>;
$hash_type = "sha512";
$timestamp = time();
$signature = hash($hash_type, $timestamp . $signature_token);
$result = (object) [
  "signature" => $signature,
  "timestamp" => $timestamp,
  "hash" => $hash_type
];
header("Content-type: application/json");
echo json_encode($result);
?>
```

## Development & Contribute

Contributions are very welcome.
Please follow the existing code structure and patterns.
Note that though integrating new contact data backends should be moderately straightforward,
a few places (e.g. the footer) are currently assuming that only
the European parliament ([actnow.email/meps](https://actnow.email/meps)) is supported.
The search form `FormMepsSelect.tsx` may be abstracted in certain places when integratin a second backend.

