use strict;
use warnings;
use Test::More;


use Catalyst::Test 'jscview';
use jscview::Controller::Map;

ok( request('/map')->is_success, 'Request should succeed' );
done_testing();
