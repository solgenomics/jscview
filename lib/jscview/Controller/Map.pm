package jscview::Controller::Map;
use Moose;
use namespace::autoclean;

BEGIN { extends 'Catalyst::Controller'; }

=head1 NAME

jscview::Controller::Map - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index

=cut

sub index :Path('/Map/view_chr/') :Args(0) {
    my ( $self, $c ) = @_;

#  $c->stash->{input_chr} = $input_chr;
#  $c->stash->{organism_html} = $organism_html;
  $c->stash(template => 'Map/view_chr.mas');

}

sub view_comparative :Path('/Map/view_comp/') :Args(0) {
  my ($self, $c) = @_;
   # get variables from catalyst object
  my $params = $c->req->body_params();
	my @query_chr = $c->req->param("input_chr");
  $c->stash(template => 'Map/view_comp.mas');

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
