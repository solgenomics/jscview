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

  my $params = $c->req->body_params();
  my $input_chr = $c->req->param("chr");
  my $input_map = $c->req->param("map");
  my $host = $c->request->base;
  my $dbhost = $host;
  $dbhost =~ s/http:\/\/maps/https:\/\/www/;
  $c->stash->{dbhost} = $dbhost;
  $c->stash->{host} = $host;
  $c->stash->{input_chr} = $input_chr;
  $c->stash->{input_map} = $input_map;
  $c->stash(template => 'Map/view_chr.mas');

}

sub view_comparative :Path('/Map/view_comp/') :Args(0) {
  my ($self, $c) = @_;
   # get variables from catalyst object
  my $params = $c->req->body_params();
  my $input_chr1 = $c->req->param("nChr1");  
  my $input_chr2 = $c->req->param("nChr2");  
  my $input_mapSId = $c->req->param("mapSId");
  my $input_mapTId = $c->req->param("mapTId");
  my $host = $c->request->base;
  my $dbhost = $host;
  $dbhost =~ s/http:\/\/maps/https:\/\/www/;

  $c->stash->{mapSId} = $input_mapSId;
  $c->stash->{mapTId} = $input_mapTId;
  $c->stash->{input_chr1} = $input_chr1;
  $c->stash->{input_chr2} = $input_chr2;
  $c->stash(template => 'Map/view_comp.mas');

}

sub view_multiple :Path('/Map/view_multi/') :Args(0) {
  my ($self, $c) = @_;
   # get variables from catalyst object
  my $params = $c->req->body_params();
  my $input_mapSId = $c->req->param("mapSId");
  my $input_mapTId = $c->req->param("mapTId");
  my $host = $c->request->base;
  my $dbhost = $host;
  $dbhost =~ s/http:\/\/maps/https:\/\/www/;

  $c->stash->{dbhost} = $dbhost;
  $c->stash->{host} = $host; 
  $c->stash->{mapSId} = $input_mapSId;
  $c->stash->{mapTId} = $input_mapTId;
  $c->stash(template => 'Map/view_multi.mas');

}

sub index2 :Path('/Map/') :Args(1) {
  my ($self, $c, $id) = @_;

  $c->stash->{input_map} = $id;
  my $host = $c->request->base;
  my $dbhost = $host;
  $dbhost =~ s/http:\/\/maps/https:\/\/www/;

  $c->stash->{host} = $host; 
  $c->stash->{dbhost} = $dbhost;
  $c->stash(template => 'Map/map.mas');
}


sub map_search :Path('/Map/map_search/') :Args(0) {
  my ($self, $c, $id) = @_;

  my $host = $c->request->base;
  my $dbhost = $host;
  $dbhost =~ s/http:\/\/maps/https:\/\/www/;

  $c->stash->{host} = $host; 
  $c->stash->{dbhost} = $dbhost;
  $c->stash(template => 'Map/map_search.mas');
}

sub map_list :Path('/Map/map_list/') :Args(0) {
  my ($self, $c, $id) = @_;

  my $host = $c->request->base;
  my $dbhost = $host;
  $dbhost =~ s/http:\/\/maps/https:\/\/www/;

  $c->stash->{host} = $host; 
  $c->stash->{dbhost} = $dbhost;
  $c->stash(template => 'Map/map_list.mas');

}

sub marker_search :Path('/Map/marker_search/') :Args(0) {
  my ($self, $c, $id) = @_;
  
  my $host = $c->request->base;
  my $dbhost = $host;
  $dbhost =~ s/http:\/\/maps/https:\/\/www/;

  $c->stash->{host} = $host; 
  $c->stash->{dbhost} = $dbhost;
  $c->stash(template => 'Map/marker_search.mas');
}

sub compare :Path('/Map/compare/') :Args(0) {
  my ($self, $c, $id) = @_;

  my $host = $c->request->base;
  my $dbhost = $host;
  $dbhost =~ s/http:\/\/maps/https:\/\/www/;

  $c->stash->{host} = $host; 
  $c->stash->{dbhost} = $dbhost;
  $c->stash(template => 'Map/compare.mas');
}

sub compare_chr :Path('/Map/compare_chr/') :Args(0) {
  my ($self, $c, $id) = @_;

  my $host = $c->request->base;
  my $dbhost = $host;
  $dbhost =~ s/http:\/\/maps/https:\/\/www/;
  
  $c->stash->{host} = $host; 
  $c->stash->{dbhost} = $dbhost;
  $c->stash(template => 'Map/compare_chr.mas');
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
