Experiment on Disputed and Claimed OSM boundaries

I made an attempted to display boundaries according to some countries official point of view. Most of boundary are consensual. But some are de facto with no recognition from one or two of the neighbors. This facto are the ground mapped in OSM.
But some countries have different political claims over the territories. Display this claim is often mandatory in these countries.
So some boundaries or territories are disputed by countries. Disputed here meaning, that the country is not officially recognized the de facto ground status. Some other boundaries or territories are claimed.
The idea here is partially based on the rejected proposed features “Mapping disputed boundaries”.

Consensual borders does not require more details.

Disputed boundaries are here treated as way level. As only a part of the de facto boundary is rejected.

Claim over territories are treated on `boundary=claim` relation as extent of the facto boundary relation. `boundary=claim` relation are not closed relation. De facto boundaries relation, minus disputed way, plus boundary=claim should done a closed relation.

In this experiment I do no try to rebuild this closed polygon. I based on [osmborder](https://github.com/pnorman/osmborder) to derive a [modified version](https://github.com/frodrigo/osmborder/tree/disputed_claim). Originally, the tool de-duplicate the border from the relations to ease the render.

So in the output of the tool, a way of boundary is marked as:

- neutral, if is part of the standard de facto ground boundary framework, the standard OSM meaning of boundaries.
- disputed, if has `disputed=yes`, `dispute=yes`, `border_status=dispute`, `disputed_by` or `boundary=disputed` tag, plus if is part of a `boundary=claim relation`. Typically can be rendered with dash. Note, a neutral de facto can be disputed.
- disputed_by, list of countries code rejecting this way as a boundary.
- claimed_by, list of countries code claiming this this way as boundary.

The de facto map can be show using the neutral marker. Additionally all ways marked as disputed and and not as neutral can be display with dash.

A political view according to a country can be display by:

1. using the neutral ways where the country is not in the disputed_by list,
2. using the ways where the country is in the claimed_by list.

To implement this on vector tiles I have to make a trick. The disputed_by and claimed_by lists can not be embedded on vector tiles and used by Mapbox GLS JS. I use an integer as bitmaps to flag a country in disputed_by and claimed_by.
