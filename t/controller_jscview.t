use strict;
use warnings;
use Test::More;


use Catalyst::Test 'jscview';
use jscview::Controller::jscview;

ok( request('/jscview')->is_success, 'Request should succeed' );
done_testing();
