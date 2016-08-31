package jscview::View::Mason;
use Moose;
use namespace::autoclean;

use strict;
use warnings;
use Moose;
use Moose::Util::TypeConstraints;

extends 'Catalyst::View::HTML::Mason';
with 'Catalyst::Component::ApplicationAttribute';


__PACKAGE__->config(
    template_extension => '.mas',
    interp_args => {
        comp_root => [
            [ main => jscview->path_to('mason') ],
        ],
    },
);

=head1 NAME

jscview::View::Mason - TT View for jscview

=head1 DESCRIPTION

TT View for jscview.

=head1 SEE ALSO

L<jscview>

=head1 AUTHOR

Vagrant Default User,,,

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
