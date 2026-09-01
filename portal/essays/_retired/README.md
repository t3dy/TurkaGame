# Retired essays

Kept for reference, excluded from the build — `build_site.py` globs `essays/*.md` and does
not recurse, so nothing here is published.

**`01_lettrism_universal_science.md`** and **`02_isfahan_circle_timurid_court.md`** were
written before the portal's scope and essay form were settled. Three problems:

1. They carried no frontmatter, so `read_essays()` fell back to the filename and the live
   index read "01 Lettrism Universal Science" and "02 Isfahan Circle Timurid Court",
   sorted last at `order: 99`.
2. They substantially duplicated intersections 05, 06 and 07, which are better: "two
   fathers for one science" is a claim, where essay 01 was a genealogy; 05 has "the trap
   inside the opportunity", where essay 02 was a survey without a thesis.
3. Their material was broad-topic survey prose. The instruction for this portal is that
   broad material belongs in **Turka-focused dictionary entries** explaining how he fits
   into or contributed to each tradition — see `neoplatonism` for the worked pattern.

Their substance now lives in the entries: `ibn-arabi`, `qunavi`, `jandi`, `suhrawardi`,
`neoplatonism`, `pythagorean-cosmology`, `ilm-al-huruf`, `barzakh`, `talismanic-science`,
`occult-science-universal`, `divine-names`, `walaya`, `isfahan-circle`,
`new-brethren-purity`, `timurid-patronage`, `shahrukh`, `baysunghur`, `mulla-sadra`.
All eighteen were verified present before these were retired.
