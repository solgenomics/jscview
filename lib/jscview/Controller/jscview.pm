package jscview::Controller::jscview;
use Moose;
use namespace::autoclean;

BEGIN { extends 'Catalyst::Controller'; }

=head1 NAME

jscview::Controller::jscview - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index

=cut

sub index :Path('/jscview/') :Args(0) {
    my ( $self, $c ) = @_;
 
    $c->stash->{template} = 'index.mas';	
}



=encoding utf8

=head1 AUTHOR

Vagrant Default User,,,

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;
