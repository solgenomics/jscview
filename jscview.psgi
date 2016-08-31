use strict;
use warnings;

use jscview;

my $app = jscview->apply_default_middlewares(jscview->psgi_app);
$app;

