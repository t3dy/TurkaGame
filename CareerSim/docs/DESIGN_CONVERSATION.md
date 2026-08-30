# Design Conversation — Career Sim kickoff (2026-08-30)

> Imported verbatim from `TurkaCareerSim.txt` (Downloads drop, 2026-08-30). This is the
> raw design conversation the CareerSim project distills. **Open by section via grep,
> never end to end** — the load-bearing conclusions live in DESIGN.md, docs/SYSTEMS.md,
> and docs/DECISIONS.md. Come here only for the rationale behind a specific call.

### Node 1 — Career Sim direction for Ibn Turka

The initial design question was how to turn the visual-novel work into a new direction for an Ibn Turka Career Sim, centered on Melvin-Koushki's interpretation of Ibn Turka, especially the “occult court” and the parallel with John Dee.

The proposed synthesis was:

* Use **FTL** for consequential, branching encounters and pressure.
* Use **DungeonAB** for capability-based choices, positional/contextual affordances, preparation, and persistent consequences.
* Use the **Alchemy Lab Simulator** as a source of economic/crafting ideas, but not necessarily as the game's model.
* Treat the **court as a laboratory of knowledge**, where scholarship, artisanship, patronage, politics, occult practice, and material production intersect.
* Make contracts, patronage, reputation, political exposure, and deadlines sources of FTL-like pressure.
* Treat knowledge as something that gets **made into artifacts**: manuscripts, diagrams, demonstrations, talismans, arguments, astronomical calculations, etc.
* Have the research pipeline turn PDFs into game-ready entities: people, practices, materials, institutions, patrons, contracts, risks, artifacts, visuals, and encounters.

The initial central loop became roughly:

**Research → synthesize → produce/deploy knowledge → encounter people/institutions → gain patronage or opposition → transmit knowledge → deal with consequences.**

The important insight was that Ibn Turka should not simply be “an alchemist at court.” His career should dramatize the relationship between **knowledge, patronage, authority, politics, and transmission**.

---

### Node 2 — Pamela Smith and Tara Nummedal as comparative design sources

The next node asked whether the Alchemy Lab Simulator could contribute ideas without turning the Ibn Turka game into another alchemy simulator.

Pamela Smith's work was brought in as a model for thinking about:

* alchemy as **material practice**
* the relationship between artisans and learned culture
* laboratories and workshops
* knowledge as something produced through making
* commerce and patronage
* the movement between court, workshop, university, and marketplace

Tara Nummedal was brought in for:

* alchemists as entrepreneurs
* court patronage
* commissions and contracts
* promises and expectations
* accusations of fraud
* legal trouble
* the precarious relationship between expertise and authority

The strongest resulting design idea was the **contract as FTL encounter**:

> A patron promises money/status in exchange for a difficult result by a deadline.

The player has to decide whether to accept, negotiate, hedge, refuse, or overpromise.

Success increases not just wealth and reputation but **future expectations**, making success itself dangerous.

That produced a possible pressure model:

**Patronage → Expectations → Exposure → Risk → Crisis.**

But the subsequent conversation correctly questioned whether even this should remain central to Ibn Turka.

---

### Node 3 — Returning to Koushki as the primary design authority

You then redirected the design toward Koushki:

> Don't build another alchemy simulator. Identify the systems that actually express what Koushki thinks Ibn Turka was about.

This produced the most important conceptual shift in the conversation.

Ibn Turka's game should be about **constructing and deploying a universal science**, rather than acquiring generic occult powers.

The proposed progression became:

**Fragmentary knowledge → synthesis → system → application → dissemination.**

The game's central resource should therefore not be gold, reagents, or generic XP.

It should be **connections**.

Letters connect to numbers.

Numbers connect to cosmology.

Cosmology connects to astronomy.

Astronomy connects to kingship.

Language connects to mathematics.

Text connects to reality.

Theory connects to technology.

The player gradually constructs an intellectual network.

---

### Node 4 — *Investigations* as the game's intellectual engine

A major insight was that Ibn Turka's *Investigations* should itself become a game system.

Rather than:

> “Ibn Turka writes a famous book.”

the player experiences:

> **Ibn Turka trying to build the intellectual machine that becomes the book.**

The player decides:

* what concepts belong together
* which authorities to invoke
* which terminology to use
* what diagrams to construct
* how much to explain
* which audience to target
* what language/register to use
* what to conceal
* what to make accessible
* how much to systematize

The manuscript therefore has properties analogous to a constructed game object:

**Scholarly authority
Accessibility
Court usefulness
Transmission
Political risk
Esoteric density**

This led to the idea that **composition itself is gameplay**.

---

### Node 5 — The New Brethren as a network system

Rather than treating the New Brethren as a conventional faction, the conversation proposed representing them as an **intellectual network**.

Relevant figures such as:

* Ibn Turka
* Sharaf al-Dīn ʿAlī Yazdī
* Qāsim-i Anvar
* Akhlāṭī
* other scholars, poets, occultists, astronomers, and patrons

become nodes in a network.

The player builds:

* relationships
* shared vocabulary
* intellectual projects
* manuscript circulation
* patronage connections
* collaborative research
* political alliances
* rivalries

The important distinction is that the player isn't simply collecting companions.

They are **building an intellectual movement**.

This also suggested a nonstandard roguelike failure condition:

> Ibn Turka can lose while the intellectual project survives.

Or conversely:

> Ibn Turka can succeed personally while his system becomes distorted, appropriated, or politically compromised.

That makes **legacy** a meaningful end-state.

---

### Node 6 — The occult court as political cosmology

The conversation then moved from “court as setting” to:

> **The court itself is an occult-political machine.**

The court should not have separate “politics” and “magic” layers.

They are intertwined.

A ruler might ask:

* What does astrology say about his reign?
* What does his name reveal?
* How does cosmology explain kingship?
* Can lettrism support imperial ideology?
* Can astronomy improve administration?
* Can occult knowledge enhance political authority?
* How should the ruler's history be narrated?

Thus a court encounter might involve simultaneously:

**astrology + lettrism + history + propaganda + philosophy + political calculation.**

This is where the John Dee comparison becomes useful: not because Ibn Turka should be made into an Islamic Dee, but because both can illuminate the enormous ambition to connect **mathematics, occult philosophy, knowledge, technology, and political power**.

---

### Node 7 — The ruler as a cosmological problem

One particularly strong Koushki-derived direction was making rulers themselves objects of intellectual interpretation.

The game can ask the player to interpret:

* the ruler's horoscope
* the ruler's name
* numerical values of letters
* Qur'anic correspondences
* historical events
* auspicious dates
* dynastic legitimacy

This creates encounters such as:

> “How long will my dynasty last?”

or:

> “What does my name reveal about my reign?”

The answer isn't necessarily a spell.

The player might choose:

* astrology
* lettrism
* history
* mathematics
* poetry
* political prudence
* refusal to predict

Different answers appeal to different constituencies.

---

### Node 8 — Court artists and artisans

Another major correction to the conventional “occult court” image was that the court should not consist primarily of occult philosophers.

The intellectual environment can include:

* calligraphers
* painters
* poets
* astronomers
* mathematicians
* manuscript designers
* jurists
* physicians
* instrument makers
* craftsmen
* historians

The court becomes a **knowledge-production ecosystem**.

A calligrapher may discover a meaningful pattern in letters.

A painter may ask for a cosmological diagram.

An astronomer may challenge the philosopher.

A poet may popularize an esoteric idea.

A historian may transform occult cosmology into dynastic propaganda.

This also connects directly to Koushki's discussion of manuscript culture and the relationship between intellectual systems and their visual/literary forms.

---

### Node 9 — Bazm and razm

A particularly gameable Koushki concept was the pairing of:

**bazm — feast/social spectacle**

and

**razm — battle/warfare.**

This provides two broad encounter environments.

Bazm can contain:

* feasts
* poetry
* music
* drinking
* jokes
* riddles
* demonstrations
* flirtation
* social maneuvering
* intellectual contests

Razm can contain:

* war
* military logistics
* hunting
* intelligence
* weapons
* battlefield applications
* political crisis

The same occult-scientific knowledge can sometimes operate in both worlds.

That makes the court much more lively than a solemn collection of scholars sitting around discussing metaphysics.

---

### Node 10 — The occult can be funny

A later but important Koushki-derived insight was that occult court culture can contain **wonder, entertainment, absurdity, and laughter**.

Examples discussed included:

* disappearing ink
* tricks involving sleep and secrets
* entertaining demonstrations
* strange mechanical or magical effects
* bizarre technologies
* apparently ridiculous tricks with practical applications

The design implication is important:

**Don't make every occult encounter solemn.**

An encounter might begin as a joke at a feast and become politically significant.

A party trick might turn into an intelligence technique.

A bizarre experiment might become a military technology.

A ridiculous rumor might become accepted doctrine.

This is particularly compatible with the FTL encounter model because encounters can have **unexpected second-order consequences**.

---

### Node 11 — Occult science versus impossible magic

Another useful Koushki-derived distinction was that occult practitioners need not believe that literally anything supernatural is possible.

Some later manuals explicitly distinguish plausible/experimentally defensible techniques from impossible claims such as instantaneous travel or shapeshifting.

That suggests a fascinating Ibn Turka mechanic:

**credulity versus demonstration.**

The player might encounter someone claiming an astonishing ability.

Possible responses:

* believe it
* investigate it
* reproduce it
* expose it as fraud
* reinterpret it philosophically
* exploit the rumor
* refuse to get involved

This gives the game an **epistemological** dimension.

The player isn't merely choosing what magic to use.

They are choosing **what counts as knowledge**.

---

### Node 12 — De-esoterization and democratization

Another major theme was the tension between secret knowledge and disseminated knowledge.

Koushki's research suggests a culture in which occult knowledge can move toward:

* broader readership
* Persian-language exposition
* simplification
* popularization
* practical application

This becomes a strategic choice for Ibn Turka.

Should the player:

**Keep knowledge difficult and elite?**

**Circulate it among scholars?**

**Teach rulers?**

**Translate it into accessible Persian?**

**Create a larger intellectual movement?**

The important point is that neither secrecy nor popularization should be automatically “good.”

They should have different consequences.

---

### Node 13 — Confessional and factional ambiguity

The conversation also identified a useful source of court complexity:

An individual's intellectual, legal, mystical, and confessional identities don't necessarily line up neatly.

An NPC might simultaneously have:

* a particular legal affiliation
* Sufi associations
* lettrist interests
* Pythagorean philosophy
* political connections
* particular attitudes toward the Prophet's family

Therefore the game shouldn't use simplistic faction labels such as:

> Sunni / Shiʿi / Sufi / Occultist

as mutually exclusive political teams.

Instead, the player must understand **which identity matters in a particular social context**.

This creates social encounters based on reading the room rather than selecting a faction from a menu.

---

### Node 14 — Translation as a core interaction

A particularly promising mechanic emerged from the emphasis on transmission and audience.

The same intellectual proposition can be translated into:

* mathematical language
* philosophical language
* legal language
* astrological language
* poetic language
* political language
* popular language

The player therefore isn't simply choosing *what they believe*.

They're choosing **how to make the same system intelligible to a particular audience**.

This could become one of the game's signature mechanics.

---

### Node 15 — Inquisition, exile, and the political danger of success

The final major historical arc concerns Ibn Turka's confrontations with political/religious authority.

The research presented:

* multiple state inquisitions
* successful defenses
* a later failed defense
* exile
* impoverishment
* legal limbo

This provides the game's central pressure curve.

The player gradually becomes:

**more knowledgeable → more influential → more visible → more politically consequential → more vulnerable.**

This is much better than a conventional “danger” meter.

The game's danger should emerge from **success**.

A successful demonstration creates expectations.

A popular book attracts scrutiny.

A powerful patron increases visibility.

A growing network looks like a faction.

A successful political prediction can make rulers dependent on you.

A successful defense of an accused occultist can associate you with the accused.

Thus:

> **Every success changes the political conditions of the next encounter.**

That is extremely compatible with the FTL/DungeonAB model.

---

### Node 16 — Proposed core Career Sim systems

The conversation eventually converged on a deliberately small system set:

**1. Synthesis**

An intellectual graph showing what Ibn Turka understands and how concepts connect.

**2. Composition**

Turning knowledge into books, diagrams, arguments, demonstrations, curricula, letters, etc.

**3. Court**

Presenting knowledge to rulers, scholars, jurists, artists, artisans, students, rivals, and administrators.

**4. Controversy**

Other people interpreting, attacking, appropriating, misunderstanding, or politicizing the player's work.

**5. Transmission**

Determining how knowledge spreads and what survives.

Potential player-facing stats were:

**Synthesis** — intellectual understanding.

**Demonstration** — ability to make theories persuasive/operative.

**Patronage** — political and financial protection.

**Transmission** — circulation of ideas.

**Authority** — legitimacy with different audiences.

**Exposure** — political visibility.

**Network** — people willing to help.

**Legacy** — survival of the project beyond Ibn Turka.

---

### Node 17 — The research pipeline

The final major design node concerns how the research corpus itself becomes game content.

The proposed pipeline should not primarily ask:

> “What historical objects can we turn into assets?”

Instead it should ask:

> **“What component of Ibn Turka's intellectual and political world does this source reveal?”**

For each PDF, extract:

**People**
Who participates?

**Texts**
What is read, written, copied, translated, or debated?

**Concepts**
What ideas are connected?

**Methods**
How is knowledge established?

**Audiences**
Who is the knowledge intended for?

**Institutions**
Where does it operate?

**Political function**
What does it allow someone to do?

**Transmission**
How does it spread?

**Conflict**
Who contests it?

**Visual form**
What does it look like?

Then automatically derive candidate:

* NPCs
* factions/networks
* locations
* encounter templates
* choices
* capabilities
* items/artifacts
* manuscript assets
* diagrams
* rumors
* controversies
* historical events
* career opportunities
* risks

The important architectural insight is:

> **The research corpus becomes a content generator for historically grounded encounters.**

---

### Node 18 — The emerging overall game thesis

The conversation ultimately moved toward this formulation:

> **Ibn Turka is a career roguelike about trying to make a universal science real.**

The player begins with scattered teachers, texts, concepts, relationships, and ambitions.

They gradually discover connections.

They construct a system.

They form an intellectual network.

They write and diagram.

They find audiences.

They seek patronage.

They enter courts.

They make their science useful.

They encounter rivals and authorities.

They defend the legitimacy of their project.

They decide how widely to transmit it.

They discover that political usefulness creates political danger.

And eventually the fundamental question becomes:

> **Can a human being construct a system of knowledge powerful enough to survive its author?**

That is the conceptual center that emerged across the conversation.

The Alchemy Lab Simulator, Pamela Smith, Nummedal, FTL, DungeonAB, the visual novel, and the research pipeline are best understood as **design tools around that center**, rather than competing models for what the game itself should be.

File
How can we learn from these designs on the visual novel to create a new direction for the Career Sim version of my Ibn Turka game. I want to bring to life the "occult court" and parallels with John Dee that Melvin-Koushki finds in the life and career of Ibn Turka. I'd like to have an encounter system inspired by FTL and also build on designs from DungeonAB. Also consider how the research pipeline will read the pdfs and find game asset ideas.

The strongest direction is not “turn the visual novel into a roguelike.” It is to turn the visual novel’s historical choice structure into a career roguelike about surviving and shaping an occult court.

The VN already contains the right raw material. Its problem is that the choices are mostly terminal narrative decisions. The Career Sim can make those same ideas continuously operational: every court, scholar, manuscript, office, rival, patron, and occult science becomes something the player can deploy when a situation presents an affordance.

The key conceptual shift is:

Ibn Turka is not exploring a dungeon. He is navigating an occult-political network.

FTL gives us the encounter grammar. DungeonAB gives us the capability/affordance grammar. The VN gives us the historical/counterfactual grammar. Melvin-Koushki gives us the world model.

1. The new core fantasy: build an Occult Court

The VN currently treats the Occult Quintet as a character skill tree. That was already identified as a serious weakness: choosing kīmiyā versus rīmiyā currently produces essentially the same game.

The Career Sim should invert this.

Your career is the gradual construction of an occult court apparatus:

patrons
fellow scholars
mathematicians
jurists
calligraphers
poets
astrologers
manuscript specialists
students
political intermediaries
texts
diagrams
instruments
offices
reputation
occult capabilities

The player is effectively asking:

What kind of occult intellectual infrastructure can I build, and how can I keep it alive as political circumstances change?

That fits the research much better than a conventional RPG skill tree.

Melvin-Koushki's argument is especially useful here because the “occult court” isn't merely a court containing people who happen to practice magic. Court ritual, architecture, kingship, bodies, books, and political technologies are all potentially occult-scientific. His description explicitly treats the Timurid-to-Safavid/Ottoman/Mughal continuum as a political order in which occult science and statecraft became unusually integrated.

That means virtually every ordinary career event can potentially become an occult encounter.

A manuscript commission isn't just a writing job.

An astronomical observation isn't just research.

A dispute isn't just a reputation check.

A wedding isn't just flavor.

A ruler's illness isn't just a medical event.

A succession crisis isn't just politics.

Each can become a situation in which the player's accumulated intellectual and social capabilities produce different possibilities.

2. FTL's biggest lesson: preparation creates verbs

This is probably the most important thing to carry over from DungeonAB.

DungeonAB v6 explicitly moved from characters as bespoke powers toward capability packages, with encounters represented as situations whose options unlock when capabilities meet environmental affordances.

That's almost exactly what Ibn Turka needs.

Instead of:

“You have 4 Hīmiyā, therefore +4 magic.”

do:

“A rival has challenged the legitimacy of your astronomical calculation.”

Then the game examines what the player has.

Perhaps:

You possess

hīmiyā 3
līmiyā 4
Yazdi as collaborator
access to the observatory
Investigations, unfinished
a reputation for mathematical rigor

The encounter generates:

Answer as a jurist
Uses legal reputation.

Answer through numerical demonstration
Requires līmiyā 3.

Invoke the authority of the observatory
Requires Yazdi/observatory affiliation.

Demonstrate the operation physically
Requires an appropriate occult science.

Refuse the challenge
Always available.

Turn the challenge into a public lesson
Requires broad teaching reputation.

The point isn't that the player has “more options because their level is higher.”

The point is that their career has changed what they can plausibly do in the world.

That is precisely what DungeonAB's preparation system was moving toward: the kit you assembled changes the options available inside later situations, with the preparation being credited in the resulting chronicle.

3. Replace the dungeon map with a Persianate career map

FTL's spatial structure can be borrowed without copying its spaceship.

Instead of:

sector → node → encounter → node

use:

career phase → court/network node → encounter → consequence → next opportunity

The map might represent the intellectual-political world:

                    SAMARKAND
                  /     |      \
             Observatory  Court  Atelier
                /          |       \
           YAZDI        ULUGH BEG   Artists
             |
CAIRO ---- ISFAHAN ---- HERAT ---- TIMURID COURTS
   \          |            |
    \      Judiciary       |
     \         |          |
       AKHLATI / QASIM-I ANVAR

But the important thing is that this is not necessarily a geographic map.

It is a career opportunity graph.

Nodes could be:

court
madrasa
atelier
observatory
judiciary
private salon
manuscript workshop
Sufi network
military household
pilgrimage site
rival court
exile destination

The player chooses where to invest attention.

This makes the central career question:

Where do I put myself next?

That is a much more interesting Career Sim question than “which quest do I accept?”

4. The player's resources should be things Ibn Turka actually needed

I would not use conventional gold/XP/HP.

Instead, the Career Sim should have perhaps six major resources.

Patronage

Access to powerful people and institutions.

Scholarly Capital

Credibility among intellectuals.

Court Visibility

How widely the player's work is known.

Security

How protected the player is against rivals, inquisitions, political reversals, etc.

Transmission

How successfully the player's knowledge is moving into other people, texts and institutions.

Time

The most interesting resource.

Every activity consumes time.

You can't simultaneously:

serve as qāḍī,
develop a new cosmology,
cultivate a patron,
teach students,
write a popular Persian work,
work with the observatory,
maintain political relationships.

That turns several existing VN choices into a genuine simulation.

For example, the VN currently asks whether Ibn Turka should prioritize judicial legitimacy or philosophical writing.

In the Career Sim that should become a recurring strategic problem.

This month:

Chief Judge duties require 3 Time.

Investigations requires 4.

Baysunghur's atelier commission requires 2.

Yazdi requests collaboration: 2.

A new student wants instruction: 1.

You have 7.

Now the game has a real career.

5. The Occult Quintet becomes a capability language

I would retain the five sciences, but stop treating them primarily as levels.

They become capability families.

For example:

Science	Career capabilities
kīmiyā	transformation, substances, laboratory work, material demonstrations
līmiyā	talismanic construction, objects, diagrams, inscriptions
hīmiyā	domination, protection, influence, political operations
sīmiyā	illusion, spectacle, misdirection, sensory manipulation
rīmiyā	wonder, trickery, deception, astonishing demonstrations

The exact historical taxonomy should remain grounded in your research corpus; the important design principle is that each science produces verbs rather than numerical bonuses.

This directly fixes the VN's problem.

The proposal already identified five science-specific “signature moments,” such as rīmiyā producing a room-turning demonstration, līmiyā activating the Ṭahawī Circle, hīmiyā providing protection during an inquisition, and sīmiyā enabling an escape by misdirection.

The Career Sim should make that principle the foundation of the entire game.

6. The court itself should behave like DungeonAB's party

This is where I think the DungeonAB design can become much more interesting in the Ibn Turka context.

In DungeonAB:

character → capability package → situation → affordance → decision

For Turka:

scholar/network → capability package → court situation → affordance → decision

You could recruit or cultivate people such as:

Yazdi

Mathematics / history / lettrism / observatory / manuscript transmission.

Qasim-i Anvar

Poetry / Sufi network / risky association / popular reach.

Akhlati

Esoteric authority / heterodox knowledge / enormous reputational risk.

A court calligrapher

Calligraphy / manuscript production / visual communication.

An astrologer

Astronomical calculation / court prediction / political utility.

A jurist

Legal defense / institutional legitimacy.

These shouldn't simply be “companions.”

They are capability packages.

Yazdi doesn't give +10 friendship.

Yazdi changes what the player can do.

7. This creates extremely good FTL-style encounters

Consider:

THE NEW MANUSCRIPT

A court scribe brings you an unfamiliar manuscript.

You can:

Examine its numerical structure
Requires mathematical/lettrist capability.

Compare it against your existing sources
Requires broad scholarly network.

Ask Yazdi to analyze it
Yazdi capability.

Have the atelier copy it
Requires court/artistic access.

Keep it secret
Reduces visibility, increases private knowledge.

Present it to the patron
Increases patronage but creates political exposure.

Now the result might be:

gain a source
gain a rival
discover a contradiction
unlock an operation
gain manuscript prestige
expose yourself to scrutiny
establish a new scholarly relationship

That's FTL's “I have the right crew member” pleasure translated into intellectual history.

8. Make the court remember

DungeonAB's “town remembers what you did to it” is particularly valuable here.

The Career Sim should have institutional memory.

Not merely:

qasimBond = 3

but:

The Court Remembers

If you previously:

humiliated a rival
rescued a scholar
refused a patron
produced an astonishing demonstration
exposed a fraudulent astrologer
defended a weak litigant
declined an occult commission
wrote a popular Persian explanation
associated publicly with Akhlati

then future encounters should know that.

This gives you the same “Chekhov's gun” correction the VN audit identified.

The VN currently has choices like the public Akhlati association and the first-inquisition recantation that were narratively supposed to matter later but initially weren't being read downstream.

In the Career Sim, this becomes foundational.

A court has memory.

A rival has memory.

A patron has memory.

A student has memory.

A manuscript tradition has memory.

9. Replace “reputation” with competing reputations

One generic reputation meter would be too crude.

I'd use perhaps four visible reputational dimensions:

Orthodox

How safe you appear to jurists and religious authorities.

Occult

How seriously occult specialists take you.

Imperial

How useful you appear to rulers and administrators.

Scholarly

How credible you are among intellectuals.

These should conflict.

For example:

Demonstrate an occult operation before a prince.

Imperial +3
Occult +3
Orthodox −2
Visibility +2

Whereas:

Explain the same phenomenon as a mathematical natural philosophy.

Imperial +1
Occult +1
Orthodox +1
Scholarly +3

Now the player is playing the exact problem Ibn Turka's career presents.

10. The John Dee parallel should be a structural design principle

The Dee material is unusually useful because Melvin-Koushki isn't simply saying “Dee and Ibn Turka were both occultists.”

The visual article itself constructs the comparison through a counterfactual career: what if Dee had pursued the Ottoman court rather than remaining frustrated by European patronage? Page 2 presents the Ottoman Empire as the alternative imperial environment for his “one-world scientific-imperialist project”; page 4 then explicitly juxtaposes Dee, Ibn Turka's Ṭahawī Circle, and Mughal Akbar.

That suggests a superb meta-structure:

“The Ibn Turka Problem”

The game isn't ultimately asking:

“Can Ibn Turka survive?”

It is asking:

“What happens when a mathematically ambitious occult scientist finds the right—or wrong—political environment for his project?”

That makes patrons extremely important.

A patron should alter the shape of the possible career.

For example:

Iskandar

Experimental court / unstable political future / high upside.

Baysunghur

Manuscript arts / cultural production / intellectual prestige.

Ulugh Beg's circle

Mathematics / astronomy / observatory.

Chief judgeship

Institutional legitimacy / legal authority / time pressure.

A rival court

Safety / reinvention / loss of established network.

Exile

Danger / freedom / transmission.

The player is effectively performing counterfactual intellectual history.

11. “Occult Court” should become the game's equivalent of a dungeon theme

DungeonAB has themed dungeons.

TurkaGame can have themed court environments.

For example:

Cairo — The Experimental Cosmopolis

High scholarly diversity. Many unusual teachers. High discovery potential.

Iskandar's Court — The Dangerous Atelier

Art, poetry, astronomy and occult politics.

Baysunghur's Court — The Manuscript Machine

Calligraphy, books, court culture, elite patronage.

Samarkand — The Observatory

Mathematics, astronomy, measurement, Yazdi, Ulugh Beg.

Isfahan — The Judge's City

Law, institutional authority, political cases, occult jurisprudence.

Exile — The Broken Network

Low security but unusual opportunities for transmission.

Each environment changes which encounter types are likely.

12. The encounter generator should use “situation + affordance”

This is the part I would make the core reusable engine.

Every encounter has:

SITUATION
    ↓
AVAILABLE AFFORDANCES
    ↓
PLAYER CAPABILITIES
    ↓
LEGAL / POLITICAL / SCHOLARLY CONSTRAINTS
    ↓
OPTIONS
    ↓
GRADIENT OUTCOME
    ↓
WORLD MEMORY

An encounter definition might conceptually look like:

{
  "id": "rival_astrologer_challenge",
  "location_tags": ["court", "observatory"],
  "affordances": ["public_audience", "astronomical_data", "manuscript_table"],
  "requirements": [
    "rimiya >= 2",
    "limiya >= 2",
    "yazdi",
    "observatory_access"
  ],
  "options": [
    "mathematical_demonstration",
    "occult_demonstration",
    "legal_argument",
    "ignore",
    "recruit_rival"
  ]
}

Notice that this is very close to what DungeonAB has already evolved toward.

The encounter isn't authored around one correct solution.

It is authored around what kinds of solutions the situation affords.

13. Use gradient outcomes rather than success/failure

This is another DungeonAB lesson worth importing.

Suppose Ibn Turka attempts an occult demonstration.

Don't simply return:

SUCCESS

or

FAILURE.

Use something like:

Triumph

The patron is astonished; rival humiliated; visibility increases.

Success

The demonstration works, but the rival becomes hostile.

Qualified success

The patron is interested but demands a written explanation.

Ambiguous

Nobody can decide whether it was genuine.

Backfire

The demonstration exposes a theoretical weakness.

Disaster

The operation becomes evidence against you.

This makes experimentation interesting.

14. The biggest new resource should be “Transmission”

This comes directly from the research's enormous historical claim.

The endings audit identified the crucial point: Ibn Turka's personal fate and the subsequent success of the astrological-lettrist platform are not the same thing. The research frames the platform as something that persisted through Timurid, Aqquyunlu, Safavid, Uzbek, Ottoman and Mughal courts.

So the Career Sim should track:

How much of the system exists outside Ibn Turka's head?

Transmission can increase through:

students
manuscripts
popularizations
diagrams
collaborations
court commissions
copied works
teaching
visual forms
patronage networks

This creates a beautiful tension:

Self-preservation vs. transmission

If you keep everything secret:

high personal security, low transmission.

If you teach widely:

high transmission, high infiltration risk.

If you write an elite Arabic masterpiece:

enormous scholarly density, limited accessibility.

If you create simplified Persian works:

greater reach, possible loss of prestige/control.

Those are already present in the VN choices around registers, teaching widely, popularization, and practical grimoires.

The Career Sim turns them into an actual economy.

15. The research pipeline should become part of the game architecture

This is probably the most important technical opportunity.

Don't make:

PDF → notes → developer invents encounter

Make:

PDF → evidence → entities → relationships → mechanics → assets → encounters

The pipeline should extract five different things.

A. Historical entities

People, places, courts, institutions, manuscripts, texts, instruments, practices.

Example:

Yazdi
Iskandar Sultan
Baysunghur
Samarkand Observatory
Investigations
Tahawi Circle
Qasimian Secrets
Akhlati
B. Actions

What people actually did.

Examples:

taught
commissioned
copied
defended
patronized
challenged
traveled
wrote
demonstrated
accused
exiled

These become potential encounter verbs.

C. Objects and visual motifs

This is where the PDF image pipeline becomes powerful.

The Melvin-Koushki papers already provide unusually good visual leads:

manuscript pages
Ṭahawī Circle
astronomical symbols
calligraphy
court portraits
maps
manuscript workshops
diagrams
talismanic structures
seals
books
instruments

The Dee article's page 3, for example, juxtaposes portraits, manuscript writing, occult symbols and a group scene; page 4 puts Ibn Turka's Ṭahawī Circle beside astrological glyphs and a portrait of Akbar.

Those aren't merely illustrations.

They're asset specifications.

D. Claims and grounding

Every extracted idea should retain:

claim
source
page
grounding
confidence
historical_date
people
places
works
possible_game_use

So the game writer can distinguish:

ATTESTED

“Baysunghur commissioned the Qur'an.”

from:

PLAUSIBLE-GAP

“Ibn Turka chose to reveal this particular doctrine at this particular moment.”

from:

INVENTED-COMPATIBLE

“A rival proposes this particular countermeasure.”

That follows the VN's existing three-level grounding system.

16. Then have the pipeline generate an “asset opportunity report”

This is where I think the research pipeline can become unusually valuable.

For every PDF, generate:

SOURCE
    ↓
PAGE INVENTORY
    ↓
TEXTUAL ENTITIES
    ↓
VISUAL ENTITIES
    ↓
HISTORICAL CLAIMS
    ↓
GAME AFFORDANCES
    ↓
ENCOUNTER SEEDS
    ↓
ASSET CANDIDATES

For example:

Source: The Occult Court

Historical entity

Boon for the Khan

Visual candidate

Opening manuscript page

Object candidate

Occult manual

Mechanic

Practical occult commission

Encounter

“A Qizilbash patron asks for something useful rather than beautiful.”

Possible capabilities

rīmiyā
sīmiyā
kīmiyā

Outcomes

Prestige / money / political usefulness / occult visibility

Grounding

Source-supported later parallel; Ibn Turka application is counterfactual.

That distinction matters enormously.

17. PDFs should produce “encounter atoms”

I'd actually give the pipeline a formal object called an Encounter Atom.

Something like:

Encounter Atom
────────────────────────
Historical trigger
People involved
Location
Institution
Source text
Source page
Grounding
Player affordances
Relevant capabilities
Potential assets
Potential consequences
Related historical event
Counterfactual license

Then dozens of these can be composed into situations.

For example:

TRIGGER:
A patron wants an astonishing demonstration.

AFFORDANCES:
court audience
manuscript
materials
rival scholar

CAPABILITIES:
rimiya
simiya
kimiya
court prestige

MEMORY:
previously humiliated rival?
public Akhlati affiliation?
popularizer?

ASSETS:
manuscript page
court interior
ink
diagram
astrological device

CONSEQUENCES:
prestige
wealth
rivalry
scrutiny
new patronage
new capability

That gives Claude Code something much more structured to work with than “write 50 historical encounters.”

18. The visual language should learn from the VN but become much denser

The current VN's visual strategy is deliberately restrained: manuscript backdrops, parchment cards, no invented portraits, and real rights-cleared manuscript imagery.

Keep that philosophy.

But the Career Sim can use the interface itself as an illuminated scholarly apparatus.

Instead of generic RPG panels:

CAREER
PATRON
SKILLS
INVENTORY
QUESTS

use:

                SAMARKAND
        ┌─────────────────────┐
        │ OCCULT COURT        │
        │                     │
        │ Yazdi       ●●●     │
        │ Observatory ●●      │
        │ Atelier     ●●●●    │
        └─────────────────────┘

MANUSCRIPTS     NETWORK       SCIENCES
Investigations  Yazdi         Hīmiyā  ●●●
Tahawi Circle   Akhlati       Līmiyā  ●●●●
                Qasim          Sīmiyā  ●●

And when an encounter occurs, bring in a manuscript/diagram/object as the visual focal point.

The game's art then isn't “fantasy Islamic magic.”

It is a playable scholarly archive.

That aligns very closely with the writing guide's rule that scenes should reveal a specific real text, institution, practice, manuscript, or historiographical fact rather than generic occult atmosphere.

19. One especially strong loop: “prepare → court → encounter → consequence → transmission”

I'd make the entire Career Sim loop:

1. Prepare

Choose what to study, whom to visit, what manuscript to work on, whom to cultivate.

2. Enter a court/network

Your current capabilities and relationships determine the encounter pool.

3. Encounter

A situation occurs.

4. Exploit affordances

Your accumulated career opens unusual responses.

5. Resolve

Gradient outcome.

6. Court remembers

Relationships, rivals, institutions and political exposure change.

7. Transmit

Some knowledge becomes embodied in people, manuscripts, institutions or popular works.

8. Move

Choose where your career goes next.

That is basically FTL's pressure loop transformed into intellectual history.

20. The “death” condition shouldn't simply be death

This is another place where the research gives us something better than a conventional roguelike.

A run could terminate because of:

death
exile
loss of patronage
public disgrace
forced recantation
institutional removal
retirement
successful consolidation of the school

But the run's final evaluation should ask two separate questions:

What happened to Ibn Turka?

and

What happened to Ibn Turka's system?

That lets you produce radically different outcomes:

Personally destroyed; intellectually triumphant.

Personally successful; intellectual project abandoned.

Court philosopher; never publicly persecuted.

Judge rehabilitated; occult project suppressed.

Exiled scholar; manuscripts successfully transmitted.

Private sage; system dies with him.

Broad popularizer; platform spreads beyond his control.

That is considerably richer than “win/lose.”

21. The historical run should not be the optimal run

This is important.

The VN correctly establishes that holding firm at the third inquisition is historically attested, but shouldn't simply be presented as the “good ending.”

The Career Sim should go further.

The historical Ibn Turka should be a playable historical trajectory, not the game's optimal build.

A player might discover:

“If I had specialized earlier in court mathematics, cultivated Yazdi more aggressively, kept Qasim at arm's length, popularized my work, and maintained judicial legitimacy, I can construct a completely different career.”

That's the actual intellectual-history fantasy.

22. The most interesting encounter category: “occult politics”

I'd make perhaps 40–50% of encounters about situations where intellectual and political action are inseparable.

Examples:

“Your patron asks whether an auspicious date should be chosen for a military campaign.”

“A rival claims your lettrist calculations are theological innovation masquerading as mathematics.”

“A calligrapher asks how the numerical structure of a sacred text should be represented.”

“A judge asks whether an accused occultist's operation constitutes legitimate science or sorcery.”

“A patron wants a talisman.”

“A poet wants the cosmology simplified into verse.”

“An astronomer challenges your cosmological hierarchy.”

“A manuscript arrives containing a diagram suspiciously similar to yours.”

“A ruler wants a demonstration.”

“An enemy wants you to discredit an astrologer.”

“Your student has copied a dangerous passage.”

“Your rival has acquired one of your diagrams.”

These are much more distinctive than conventional RPG quests.

23. The research pipeline can continuously feed this system

The ultimate architecture could be:

                  HISTORICAL PDFs
                       │
             ┌─────────┴─────────┐
             │                   │
          TEXT OCR           PAGE IMAGES
             │                   │
             ▼                   ▼
       CLAIM EXTRACTION      VISUAL EXTRACTION
             │                   │
             └─────────┬─────────┘
                       ▼
                RESEARCH GRAPH
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     PEOPLE          OBJECTS       PRACTICES
        │              │              │
        ▼              ▼              ▼
    RELATIONSHIPS    ASSETS       AFFORDANCES
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                ENCOUNTER ATOMS
                       │
                       ▼
                 SITUATION ENGINE
                       │
                       ▼
                   CAREER SIM
                       │
                       ▼
                  RUN CHRONICLE
                       │
                       ▼
                 RESEARCH/ASSET
                   FEEDBACK

The last step is important: when you discover that an encounter needs a particular kind of object, the pipeline should be able to search the corpus for it.

So instead of:

“We need an image for the observatory.”

you can query:

“Find every manuscript illustration, diagram, instrument, architectural image, map, or scholarly reference in our corpus associated with Samarkand astronomy.”

The result becomes an asset shortlist with provenance.

24. I would therefore define the Career Sim around four systems

Not twenty.

Career

Time, offices, patrons, scholarly projects and movement.

Capabilities

The Occult Quintet + people + texts + institutional access.

Situations

FTL-style encounters whose options emerge from capabilities meeting affordances.

Transmission

The long-term propagation of Ibn Turka's intellectual system.

Everything else should mostly be derived from those.

That gives us a clean relationship:

CAREER
   ↓
CAPABILITIES
   ↓
SITUATIONS
   ↓
CHOICES
   ↓
CONSEQUENCES
   ↓
MEMORY
   ↓
TRANSMISSION
   ↓
CAREER

And it solves the biggest weakness revealed by the VN audit. Instead of having 40 choices whose downstream consequences need to be painstakingly wired together, the game becomes a system in which the entire accumulated career is itself the state that generates possibilities.

The most promising design phrase for the project is therefore:

Ibn Turka: The Occult Court — an FTL-style career roguelike in which scholarship, patronage, occult science, manuscripts, and political danger interact as a living intellectual network.

The historical research isn't just the writing source. It becomes the content-generation substrate: every documented person, manuscript, diagram, institution, practice, controversy and political transition can become an encounter atom, capability, affordance, memory, or asset.

And Melvin-Koushki's Dee comparison gives the game its deeper thesis: what happens when an occult scientist tries to make an empire into a laboratory for a new conception of knowledge? The Dee article's own visual juxtaposition of Dee, Ibn Turka's Ṭahawī Circle and Akbar makes that comparative imperial frame unusually explicit.

That is a much larger and more distinctive game than the current “esoteric scholar career sim” placeholder, which is appropriately still parked while the VN proves the asset pipeline.

MEGABASEAGAIN.md
File
MEGABASEFIRSTIMPRESSIONS.md
File
MEGASTRUCTIONS.md
File
README(20260830-200333).md
File
how might we crib notes from my alchemy lab simulator? I'm also thinking about the research of Pamela Smith on the business of alchemy and connections between alchemists and artisanal culture, and Tara Nummedal on alchemists interacting with european courts and getting in legal or political trouble

The alchemy lab simulator gives us a very useful missing layer for Ibn Turka: make occult knowledge materially productive, economically embedded, and socially dangerous. That is a better bridge between the “occult court” idea and the FTL/DungeonAB encounter architecture than simply adding more occult spells.

Your existing Laboratory of Art already has the right miniature: a constrained material economy, recipes, city demand, skills that unlock encounter options, and encounters spanning artisanal, courtly, mercantile, and legal worlds.

Smith and Nummedal give us the historical theory for expanding that miniature.

1. The key lesson from Smith: knowledge is something you make

Pamela Smith's The Business of Alchemy is explicitly about the relationship between alchemy, court, and commerce, following Johann Joachim Becher's movement between university, laboratory, court, economic projects, and political schemes.

And her broader argument about artisanal epistemology is especially useful: alchemy was unusual because practitioners worked simultaneously with texts and their hands, with making things serving as a way of knowing nature.

That suggests we should not make Ibn Turka's game primarily about having occult knowledge.

Make it about putting knowledge into forms that circulate.

For example:

a manuscript
a diagram
a talisman
an astronomical calculation
a medical preparation
a demonstration
a teaching session
a legal opinion
a court spectacle
a commissioned object
a practical recipe
a student's copy
a popular Persian exposition

This meshes beautifully with your existing Transmission idea.

The player doesn't just accumulate knowledge. They constantly decide:

What form should this knowledge take, and who should receive it?

That is much closer to the actual history of artisanal and occult knowledge.

2. Bring the Laboratory of Art directly into the court

The most interesting adaptation is not giving Ibn Turka a literal alchemy laboratory.

It's making the court itself function as a laboratory.

Think of three overlapping spaces:

              OCCULT COURT

       ┌───────── COURT ─────────┐
       │                         │
       │ patronage     politics  │
       │     \           /       │
       │      \         /        │
       │       LABORATORY         │
       │       /   |   \         │
       │      /    |    \        │
       │ manuscripts  instruments│
       │       \    |    /       │
       │       ARTISANS           │
       └─────────────────────────┘

The workshop, manuscript atelier, observatory, judicial chamber, treasury, library, and private audience chamber become different affordance spaces.

This is exactly where your DungeonAB model can become interesting.

A location isn't scenery.

It supplies affordances.

3. The “recipe” mechanic becomes an “operation” mechanic

Your alchemy simulator has:

ingredients → recipe → product → market

Ibn Turka could have:

knowledge → operation → artifact/action → audience → consequence

For example:

Knowledge

Lettrist numerology + astronomical calculation

Operation

Construct a numerical diagram

Artifact

Ṭahawī Circle

Audience

Scholar / patron / student / ruler

Consequence

Different depending on who sees it.

A scholar might produce:

scholarly credibility

A patron:

patronage

A jurist:

suspicion

A student:

transmission

A rival:

competition

A ruler:

political interest

The same “recipe” therefore produces radically different outcomes depending on the social context.

That's excellent game design because it means the player isn't merely collecting recipes.

They are learning how to deploy knowledge.

4. Smith also suggests making artisans actual characters

This could dramatically improve the Career Sim.

The player's network shouldn't consist only of scholars.

Have:

goldsmiths
paper makers
illuminators
calligraphers
dyers
metalworkers
apothecaries
instrument makers
engravers
builders
astrologers
physicians
merchants

The historical point is important: alchemical knowledge circulated through artisanal and commercial worlds, not just elite textual scholarship. Smith's work and the scholarship summarized in Words and Works emphasize this intersection of practical techniques, commerce, artisanship, and court patronage.

For Ibn Turka, that means a calligrapher can be as mechanically interesting as a philosopher.

A calligrapher could unlock:

inscription-based operations

An instrument maker:

astronomical affordances

A metalworker:

material demonstrations

A physician:

medical applications

A merchant:

circulation and patronage

A manuscript dealer:

rare texts

Now your “party” starts looking much more like an actual early-modern knowledge network.

5. Nummedal gives us the perfect FTL pressure system: contracts

This may be the single best mechanic to steal.

Nummedal describes alchemy as becoming something that could be bought, sold, and contracted, with entrepreneurial alchemists negotiating with noble patrons. Those arrangements could become dangerous when expectations exceeded what the practitioner could deliver.

That translates almost directly into an FTL encounter mechanic:

The patron offers you a contract.

For example:

THE PRINCE'S COMMISSION

The prince offers:

500 dinars

to produce:

a successful transmutation demonstration

within:

40 days

You can accept, negotiate, modify, defer, or refuse.

Once accepted, the contract becomes persistent state.

CONTRACT
Prince's Silver Commission

Reward: +500
Deadline: 40 days
Required result: public demonstration
Reputation at stake: Imperial
Failure consequence: severe
Secrecy: low

Suddenly the career has teeth.

You have to decide:

Do I actually believe I can do this?

That is much more interesting than an RPG quest.

6. And contracts should create the FTL countdown

FTL works partly because decisions have temporal pressure.

So instead of generic “energy,” give the player:

Time

and Obligations.

You might have:

CURRENT OBLIGATIONS

Court appointment       2 days
Manuscript commission   5 days
Yazdi collaboration     7 days
Patron demonstration    14 days
Student examination     18 days

Travel, research, experimentation, socializing and writing consume time.

The player can therefore get themselves into trouble simply by being too ambitious.

That's historically appropriate.

Smith's Becher is useful precisely because his career involves continual movement among courts, projects, collaborators, laboratories, economic schemes and political ambitions.

7. Failure should come from overpromising

This is where Nummedal becomes a game mechanic rather than just historical flavor.

Her central question is:

What distinguishes the true alchemist from the fraud?

Her research shows that accusations of fraud were embedded in the entrepreneurial arrangements themselves; patrons had expectations, practitioners made claims, and the economic structure could encourage dangerous promises.

So create a hidden/partially visible variable:

Credibility

And another:

Expectation

Every spectacular success raises expectations.

That's crucial.

Imagine:

SUCCESS
↓
+ Court Prestige
+ Wealth
+ Visibility
+ Patron Trust
↓
BUT
+ Expectations

Then the next patron says:

“The last demonstration was extraordinary. Surely you can produce ten times as much.”

Now success itself creates future danger.

That's excellent roguelike design.

8. The court can become an escalating “heat” system

Instead of a generic danger meter:

Political Exposure

could respond to:

public occult demonstrations
association with controversial figures
promises to rulers
failed commissions
rival accusations
heterodox claims
unexplained wealth
political predictions
military applications

And importantly:

different factions interpret the same act differently.

A spectacular operation might produce:

Court:          +++
Scholars:       ++
Artisans:       +++
Jurists:        -
Rivals:         ---
Students:       +++

This is much better than a universal morality meter.

9. This gives us a three-way tension

I think the Career Sim should ultimately revolve around:

Knowledge

Can I discover or construct something?

Commerce

Can I turn it into something useful, valuable, or patron-worthy?

Authority

Can I persuade people that I am legitimately entitled to practice it?

Those three are constantly in conflict.

              KNOWLEDGE
                 /\
                /  \
               /    \
              /      \
         COMMERCE ─── AUTHORITY

You can be:

Brilliant but commercially useless.

Rich but regarded as a fraud.

Authoritative but unable to produce anything.

A successful artisan with little textual prestige.

A court favorite whose enemies are waiting for failure.

A scholar whose knowledge survives through students but who never becomes wealthy.

Those are much more historically interesting careers than “wizard level 12.”

10. The legal encounter system becomes central

This is where Nummedal gives you an enormous encounter library.

Her book specifically draws on criminal trials, contracts, laboratory inventories, satires and vernacular treatises.

Those source types map almost perfectly onto your research pipeline.

A PDF about an alchemist doesn't just yield “lore.”

It yields:

Contracts → encounter mechanics

Trial records → crisis encounters

Inventories → asset/reagent systems

Satires → reputation/social encounters

Treatises → knowledge/capability systems

Laboratory descriptions → locations and visual assets

That's the pipeline architecture I'd use for Ibn Turka.

11. The Ibn Turka version shouldn't literally become European alchemy

The Smith/Nummedal material is valuable as a comparative design model, not because we should transplant sixteenth-century German commercial alchemy into a Timurid game.

Instead, ask:

What is the equivalent institution or pressure in Ibn Turka's world?

For each European mechanic:

Smith/Nummedal	Ibn Turka analogue
Prince's laboratory	Court/atelier/observatory
Alchemical contract	Scholarly/technical commission
Philosopher's Stone promise	Occult-scientific promise
Goldmaking	Useful occult/scientific demonstration
Laboratory inventory	Manuscripts, instruments, substances
Artisan network	Calligraphers, craftsmen, physicians, astronomers
Fraud accusation	Intellectual/religious/political challenge
Trial	Inquisition/judicial confrontation
Patronage	Court affiliation
Vernacular alchemy	Persian popularization
Laboratory secrecy	Esoteric transmission
Entrepreneurial identity	Court scholar / occult specialist / jurist

The research should tell us where the analogy stops.

That distinction is important.

12. The laboratory itself could become a “workbench” UI

This is where I'd borrow very heavily from Laboratory of Art.

Instead of having an inventory full of generic RPG objects, give Ibn Turka a scholarly workbench:

┌──────────────────────────────────────────┐
│              WORKBENCH                   │
├──────────────┬───────────────────────────┤
│ TEXTS        │ OPERATION                 │
│              │                           │
│ Investig.    │  [Numerical Diagram]      │
│ Tahawi       │                           │
│ Yazdi        │  Text ── Number ── Form   │
│ Akhlati      │                           │
│              │  Required:                │
│              │  Yazdi ✓                  │
│              │  Observatory ✓            │
├──────────────┴───────────────────────────┤
│ AUDIENCE: Court Prince                    │
│ RESULT: Demonstration / Commission        │
└──────────────────────────────────────────┘

The player physically assembles an intellectual operation.

That could be one of the game's signature interactions.

13. “Crafting” should mean composing an intellectual artifact

This is where the alchemy simulator can become much more than inspiration.

Craft:

a diagram
an argument
a manuscript
a talisman
a horoscope
an astronomical table
a demonstration
a medical recipe
a teaching text
a Persian popularization

Each artifact has properties.

For example:

Ṭahawī Circle

Complexity: 4
Occult authority: +4
Scholarly authority: +3
Visual impact: +5
Transmission difficulty: 4
Political risk: 3

Then you choose where to deploy it.

The same artifact can be:

shown privately
demonstrated publicly
given to a patron
taught to a student
encoded into a manuscript
withheld
altered for a different audience

That is where the “business of alchemy” becomes business of knowledge.

14. This also solves the John Dee problem

The Dee parallel becomes much richer if you treat Dee as the extreme version of the career fantasy.

The player is trying to construct an integrated intellectual/political project:

mathematics + occult science + imperial patronage + instruments + texts + political usefulness

The question isn't:

“Can I cast spells?”

It's:

Can I persuade an empire to fund my theory of knowledge?

That is an extremely strong game premise.

And it gives you a natural late-game escalation:

Scholar

→ Practitioner

→ Court intellectual

→ Occult entrepreneur

→ Advisor

→ Architect of a knowledge institution

→ Political liability

At the highest level, you're not running a lab anymore.

You're trying to build an occult court infrastructure.

15. I would add one mechanic from the alchemy simulator that we haven't emphasized enough: demand

Your existing lab has city demand.

I would absolutely retain that idea.

But Ibn Turka's “market” isn't primarily money.

It's court demand.

Different places demand different knowledge:

SAMARKAND
Astronomy █████
Mathematics █████
Occultism ███
Medicine ██

HERAT
Manuscripts █████
Poetry ████
Occultism ████
Mathematics ██

ISFAHAN
Law █████
Administration ████
Medicine ███
Occultism ██

Now the player has to figure out:

What is this court hungry for?

That creates a powerful loop:

Research what you can do → identify demand → make something → present it → gain patronage → acquire new capabilities.

That is essentially Laboratory of Art expanded into intellectual history.

16. The research pipeline should explicitly extract “economic affordances”

I'd modify the PDF pipeline we discussed earlier.

For every source, ask it to extract:

People

Who?

Practices

What do they do?

Materials

What do they work with?

Institutions

Where?

Markets

Who wants it?

Patrons

Who pays?

Contracts

What is promised?

Risks

What happens if it fails?

Authorities

Who decides whether it is legitimate?

Artifacts

What gets produced?

Visuals

What can we show?

That gives you a much more powerful source-to-game transformation.

For example:

PDF
 ↓
"alchemist contracted to produce X"
 ↓
PERSON
PATRON
CONTRACT
PRODUCT
DEADLINE
RISK
LEGAL AUTHORITY
 ↓
ENCOUNTER TEMPLATE

Or:

PDF
 ↓
"artisan uses technique to produce material Y"
 ↓
ARTISAN
MATERIAL
TECHNIQUE
WORKSHOP
PRODUCT
 ↓
CRAFTING RECIPE
NPC
LOCATION
ASSET
ENCOUNTER
17. And this gives us a much better definition of an encounter

I would now define a Career Sim encounter as:

A historically grounded situation in which somebody wants something from Ibn Turka and his available knowledge network determines what he can offer, promise, conceal, demonstrate, or refuse.

That's much more specific than “random historical event.”

Examples:

A patron wants an astonishing result.

A craftsman wants technical assistance.

A scholar wants an argument settled.

A student wants access to forbidden knowledge.

A merchant wants a profitable preparation.

A ruler wants a prediction.

A jurist wants an explanation.

A rival wants to expose you.

A court wants a spectacle.

A manuscript dealer offers a dangerous text.

A workshop needs your expertise.

A patron wants you to promise something you cannot guarantee.

The player's career determines which answers exist.

18. The strongest synthesis is therefore “Laboratory + Court + FTL”

I'd make this the core design triangle:

             COURT
          patronage
         reputation
        politics
            /\
           /  \
          /    \
         /      \
   LABORATORY ─── FTL
    making       encounters
    materials    pressure
    expertise    consequences

Laboratory of Art teaches us how to make knowledge/materials into a compact economic game.

Smith teaches us that making, artisanship, commerce and learned knowledge belong in the same system.

Nummedal teaches us that contracts, patron expectations, authority and fraud make entrepreneurial expertise dangerous.

FTL gives us pressure, travel, obligations, and encounters.

DungeonAB gives us capability packages, affordances, preparation, memory and gradient outcomes.

Melvin-Koushki gives us the historical intellectual premise: occult science isn't peripheral to courtly power; it can be imagined as part of a much larger project of knowledge, kingship and empire.

That produces a much stronger game:

Ibn Turka is building a career in which every piece of knowledge must eventually answer the question: who wants this, what can I make from it, who will believe me, and what happens if I promise too much?

And that, in turn, gives the research pipeline a very concrete job: turn scholarship into people, materials, institutions, demands, contracts, artifacts, risks, and encounter affordances.

One particularly useful next design step would be to take the six ingredients currently in Laboratory of Art—reagents, products, skills, demand, encounters, and legal/court pressure—and make a one-to-one Ibn Turka version of each, rather than designing the larger Career Sim abstractly. That would give us a very small playable vertical slice while preserving the DNA of the existing simulator.

I don't necessarily want to build another alchemy simulator though let's go back to melvin koushki and pick systems that really get to the core of what he thinks Turka was about. I am working for Koushki and have his permission to quote verbatim from his works so pull some quotes and give me some summaries of his works with considerations from a narrative designer who will pick the best ideas from the above career simulator roguelike discussions to best realize and show off the research on Turka

The strongest conclusion from going back to Melvin-Koushki is that we should not make Ibn Turka into an alchemist with a court attached to him. The alchemy simulator is useful as a design vocabulary, but the actual Ibn Turka game should model something much more specific:

the attempt to turn lettrism into a universal, mathematical, technologically usable science—and to make that science socially and politically consequential.

That is a much more distinctive game.

Koushki's own framing is unusually gameable. In the Prologue to Pythagorean Renaissance, he calls Investigations “the first summa of Islamic Pythagoreanism” and describes Ibn Turka's project as becoming “source code” for later Persianate empires. The game should therefore make Investigations feel less like one book the protagonist writes and more like the operating system he is trying to build for the world.

What I think Koushki is actually arguing about Ibn Turka

There are several overlapping arguments in these works, but I would reduce them to six.

1. Ibn Turka is trying to construct a universal science

This is the foundation.

The important thing about Ibn Turka is not simply that he knows occult sciences. He is attempting to systematize them, mathematize them, connect them to philosophy, and make them usable across intellectual disciplines.

Koushki calls Investigations “the most philosophically systematic formulation of lettrism ... ever penned.”

And he stresses that Ibn Turka's project was not an antiquarian exercise. The Persian works were intended to make this new synthesis usable to royal patrons and the scholarly community.

This gives us the game's primary progression system.

Not:

Occult Skill 1 → Occult Skill 2 → Occult Skill 3

but:

Fragmentary knowledge → synthesis → system → application → dissemination.

The player should constantly be trying to connect things that initially appear separate.

Letters ↔ numbers
Numbers ↔ cosmology
Cosmology ↔ astronomy
Astronomy ↔ kingship
Kingship ↔ ritual
Language ↔ mathematics
Text ↔ reality
Theory ↔ technology

That is a far more interesting progression tree.

2. The “occult” part is inseparable from political theory

This is probably the biggest lesson from The Occult Court.

Koushki says that in the post-Mongol Persianate world, occult science and the magical state became extraordinarily integrated, with the Timurid, Safavid, Ottoman, Uzbek and Mughal worlds embracing an astrological-lettrist platform as an imperial cosmology and political science.

The particularly important phrase is:

“the default imperial cosmology and political science”

That's the game.

The player isn't trying to convince a king that magic exists.

The player is trying to convince powerful people that a particular theory of the cosmos tells them something useful about how to rule.

That makes a court encounter much more interesting.

Instead of:

“The prince asks you to perform magic.”

we want:

The prince asks what your science says about kingship.

Or:

A ruler wants an auspicious date for an expedition.

A court historian wants your cosmological scheme incorporated into imperial history.

An astronomer wants to know whether your numerical system can improve astronomical calculation.

A jurist wants to know whether this new science is compatible with orthodoxy.

A prince wants to become the kind of ruler your philosophy says a ruler should be.

The occult is therefore not a spell system.

It is a theory of political reality.

3. The most important “resource” should be synthesis

This is where I'd deliberately depart from the alchemy simulator.

Don't make the central resource money, reagents, products, or even generic knowledge.

Make it connections.

Imagine Ibn Turka's intellectual state as a growing network:

                 GOD
                  │
             COSMOLOGY
             /    │    \
        LETTERS  NUMBER  LIGHT
          │        │       │
       LANGUAGE  MATH   PERCEPTION
          │        │       │
       QUR'AN   ASTRONOMY  SOUL
          \        │       /
           \       │      /
             KINGSHIP
                 │
              EMPIRE

A new text or teacher doesn't simply give +1 Knowledge.

It gives you a new connection.

That connection can unlock a new interpretation, argument, diagram, or political application.

This is where the DungeonAB “capability package” idea becomes particularly appropriate.

A scholar, book, diagram, teacher, patron, or observation can modify the set of things you can see as connected.

4. The book itself should be a game mechanic

This may be the most distinctive thing we can take from Koushki.

He repeatedly treats Ibn Turka's books as active technologies rather than passive containers of information.

The Prologue describes Investigations as a “psychedelic mantra and talismanic machine itself.”

And one of the most striking arguments is that the book's form participates in its argument: the diagrams are deliberately simple, explained, and designed for uptake; Ibn Turka adapts his terminology to facilitate reception across different scholarly communities.

That gives us a brilliant mechanic:

Build the book.

The player isn't just researching.

They decide:

what to include
what to omit
which terminology to use
which diagrams to construct
whether to write Arabic or Persian
how difficult to make the system
whom the work is intended for
whether to conceal or reveal its sources
how much to systematize
whether to make it portable

The book has design parameters.

And those parameters change who can use it.

A dense Arabic theoretical work might have:

Scholarly prestige +++
Accessibility +
Court usefulness ++
Popular transmission −

A Persian synthesis might have:

Scholarly prestige ++
Accessibility +++
Court usefulness +++
Transmission +++

Now “write a book” becomes an actual strategic decision.

5. This is where the “democratization” theme becomes playable

Koushki repeatedly emphasizes a paradox:

Ibn Turka's work can be extremely sophisticated and elitist while simultaneously being more accessible and democratizing.

The Prologue describes his Persian works as more accessible and explicitly oriented toward transforming warlords into philosopher-kings and philosophers into Pythagorean lettrists.

And The Occult Court identifies “de-esotericisation and democratisation” as a defining feature of these early modern occult-scientific cultures.

That suggests a major career dilemma:

Who gets the knowledge?

The player can choose between:

Esoteric mastery

Keep the system difficult, restricted and prestigious.

Scholarly circulation

Share it with an intellectual community.

Court deployment

Teach rulers and administrators.

Persian popularization

Make the system portable and broadly accessible.

Circle-building

Create a new intellectual community capable of carrying it forward.

The important thing is that these shouldn't be morality choices.

They should be strategic choices about the future of a knowledge system.

6. The New Brethren should be a system, not just an NPC group

This is one of the biggest opportunities.

Koushki identifies Ibn Turka and Sharaf al-Dīn ʿAlī Yazdī as jointly creating the astrological-lettrist platform that subsequently defined Persianate imperial cosmology for centuries.

So don't make Yazdī simply:

“Ibn Turka's friend.”

Make him a network node.

And don't make the New Brethren simply:

“a faction.”

Make them the player's first experiment in institution-building.

You might have:

NEW BRETHREN

Members
Texts
Shared vocabulary
Research projects
Doctrinal coherence
Political connections
Public visibility
Internal disagreement
Transmission

A run can succeed even if Ibn Turka personally fails, provided the network survives.

That is historically much more interesting.

7. This gives us a much better roguelike “death”

I would now reject ordinary RPG death almost entirely.

A run can fail in several different ways:

Ibn Turka survives but the project dies.

Ibn Turka is disgraced but the project survives.

The project becomes popular but is transformed beyond his control.

The court adopts the system but strips away its philosophical core.

The scholarly circle becomes stronger than the founder.

The founder becomes politically powerful but intellectually compromised.

The system is suppressed and survives underground.

That makes the “legacy” system enormously important.

The player should care about what survives them.

The John Dee parallel now becomes much sharper

I think we were previously leaning too hard on “Ibn Turka = Islamic John Dee.”

Koushki's comparison is more interesting than that.

In Being with a Capital B, he describes Ibn Turka's lettrism as central to his life project and emphasizes his role in the philosophical systematization and sociopolitical mainstreaming of the science.

The Dee comparison is useful because both men can be understood as trying to join:

mathematics + occult philosophy + textual interpretation + technology + political power.

But Ibn Turka's distinctive contribution is that his project becomes embedded in a Persianate imperial intellectual ecosystem.

So Dee should function as a comparative shadow, not a template.

The player should occasionally realize:

“Ibn Turka is trying to solve the same enormous problem that Dee later confronted: how do you turn universal knowledge into an imperial project?”

That's the historical revelation the game can deliver.

The “Occult Court” should therefore be an intellectual machine

I'd now abandon the idea of a court as essentially a social hub.

Instead:

                 OCCULT COURT

          ┌─────── RULER ───────┐
          │                     │
       Patron                 Policy
          │                     │
          ▼                     ▼
       SCHOLARS ←→ TEXTS ←→ INSTITUTIONS
          │           │           │
          │           ▼           │
          └──── COSMOLOGY ────────┘
                       │
                       ▼
                  IMPERIAL USE

Every encounter asks:

Can Ibn Turka make his science useful here?

And the answer depends upon what the player has built.

The encounter system becomes much more specific

FTL is still useful, but the encounter unit should be:

A problem presented by an intellectual/political environment, with solutions generated from the player's accumulated network of people, texts, concepts, institutions and previous decisions.

For example:

THE PRINCE'S QUESTION

A Timurid prince asks:

“If letters are the architecture of creation, what does that tell us about the architecture of kingship?”

Possible responses:

Invoke Ibn ʿArabī.

Demonstrate the numerical structure.

Show the Ṭahawī Circle.

Bring Yazdī into the discussion.

Translate the argument into Persian.

Turn the question into a lesson in philosopher-kingship.

Refuse to simplify the theory for a prince.

Those aren't spell checks.

They're intellectual strategies.

And different combinations of people/texts/capabilities unlock different responses.

Another encounter: the dangerous accusation

A jurist challenges the legitimacy of ʿilm al-ḥurūf.

The player might:

Defend it as mathematical science.

Frame it through Ibn ʿArabī.

Demonstrate its astronomical utility.

Appeal to a respected predecessor.

Produce a diagram.

Distinguish theoretical lettrism from practical magic.

Refuse the premise of the accusation.

This is where the historical inquisitions become dramatically useful.

Koushki emphasizes that Ibn Turka's apologies and creedal statements are evidence that modern attempts to reduce him to a generic Shiʿi/Sufi mystic miss the center of his project.

So the game should make self-definition under pressure a core mechanic.

This suggests five actual game systems

I'd keep it remarkably small.

1. Synthesis

The intellectual graph.

You acquire texts, teachers, observations and concepts and discover relationships among them.

2. Composition

You turn synthesis into artifacts:

books
diagrams
commentaries
arguments
curricula
letters
demonstrations
3. Court

You present those things to different audiences.

Ruler, jurist, scholar, Sufi, mathematician, administrator, student, rival.

4. Controversy

Other people interpret your work.

They can misunderstand it, appropriate it, attack it, patronize it, popularize it or institutionalize it.

5. Transmission

You determine whether your intellectual system remains:

private
scholarly
courtly
popular
institutional
international

That's enough.

I would not add a reagent economy, elaborate crafting tree, dozens of character stats, or a conventional combat system.

The visual design should emphasize “cosmic text”

This is where Koushki's work gives us an unusually strong visual direction.

The game should make the player feel that reading, writing, diagramming and seeing are forms of action.

Koushki's discussion of Investigations explicitly connects the written, spoken and mental forms of the Letter, while the prologue's mathematical-linguistic structure is itself part of the work's operation.

So imagine the interface evolving:

Early game:

books → notes → concepts

Middle:

concepts → diagrams → relationships

Late:

diagrams → cosmological system → court applications

Eventually the player can literally see their intellectual system becoming more coherent.

The visual interface becomes a living cosmogram.

This also gives the research pipeline a much more precise job

I would change the pipeline we discussed earlier.

Don't ask the PDF processor primarily:

“What assets could we make from this?”

Ask:

“What components of Ibn Turka's intellectual machine does this source reveal?”

For every source, extract:

PERSON

Who participates?

TEXT

What is being read, written, copied or transformed?

CONCEPT

What idea is being connected to what?

METHOD

How does someone establish knowledge?

AUDIENCE

Who is this knowledge for?

INSTITUTION

Where does it operate?

POLITICAL FUNCTION

What does it allow someone to do?

TRANSMISSION

How does it spread?

CONFLICT

Who rejects or contests it?

VISUAL FORM

What does this knowledge look like?

That is much more faithful to Koushki than an “alchemy recipe” ontology.

And PDFs can generate actual game mechanics

Suppose the research pipeline finds:

Ibn Turka writes a work for a particular patron.

The system should produce:

Person: patron
Artifact: book
Audience: court
Intent: philosophical/political
Capability: court persuasion
Possible encounter: commission
Possible system: patronage
Possible visual asset: manuscript frontispiece
Possible consequence: increased political influence

Another passage says:

Ibn Turka and Yazdī collaborate.

Then:

Relationship: collaboration
Capability: mathematical-lettrist synthesis
Network: New Brethren
Encounter unlock: joint research
Legacy: platform formation

A passage about the inquisition produces:

Institution: judiciary
Conflict: orthodoxy vs innovation
Capability: apologetics
Encounter: doctrinal challenge
Risk: political exposure
Legacy: defense of the system

This is the research pipeline becoming the game's content compiler.

Three Koushki works should dominate the design

If I were the narrative designer deciding what to read first, I would prioritize these:

The Quest for a Universal Science

This is the character motivation and intellectual progression layer.

The central question is:

What would it mean for Ibn Turka to actually succeed in constructing a universal science?

The player needs to experience the intellectual ambition, not merely hear about it.

The New Brethren of Purity

This is the social/network/legacy layer.

The important idea is that Ibn Turka isn't an isolated genius. He participates in a project of synthesis, popularization, and intellectual community-building. Koushki's bibliography identifies this as a central 2025 treatment of “Ibn Turka and the Renaissance of Pythagorean Science in the Early Modern Persian Cosmopolis.”

The Occult Court

This is the political/application layer.

Its crucial insight is that court culture itself can be occult-scientific: ritual, architecture, the ruler's body, books and political technologies can all participate in the same cosmological system.

Then Of Islamic Grammatology gives us the visual/textual interface, while Imperial Talismanic Love gives us the political-literary imagination of the prince. Both are explicitly part of Koushki's Ibn Turka corpus.

A few quotes that I think should become design principles

Because you have Koushki's permission, these are particularly useful as internal design epigraphs. I'm keeping the quotations short.

From Prologue to Pythagorean Renaissance:

“This Timurid imperial masterwork is the most philosophically systematic formulation of lettrism ever penned.”

Design implication: the game should be about system-building.

From the same work:

“Ibn Turka ... may thus be profitably read as a Muslim Iamblichus and Cusanus and Pico and Bruno and Dee.”

Design implication: the Dee comparison belongs at the level of intellectual ambition, not surface aesthetics.

From The Occult Court:

“the political was and is magical as a rule.”

Design implication: don't separate “magic encounters” from “political encounters.” They are often the same encounter.

And perhaps the most useful:

“The science of magic and talismans joins commoners to kings and kings to angels.”

Design implication: the network between levels of society is itself a mechanic.

Finally, Koushki's description of the later tradition provides a particularly strong model for the player's long-term objective:

“applied lettrism remains an important technology of empire and personal advancement alike”

Design implication: the player should constantly be balancing advancing the system against advancing Ibn Turka himself.

The resulting game is much clearer to me now

I would pitch it internally as:

A career roguelike about trying to make a universal science real.

You begin with scattered teachers, texts, intellectual influences and ambitions.

You gradually construct a system.

You find people capable of understanding different pieces of it.

You form a circle.

You write.

You diagram.

You explain.

You seek patrons.

You encounter courts.

You attempt to make the system politically useful.

People challenge its legitimacy.

You defend it.

You simplify it.

You disseminate it.

People appropriate it.

Rulers try to use it.

Your rivals reinterpret it.

And eventually the central question becomes:

Can a human being build a system of knowledge powerful enough to outlive its author?

That gets much closer to what Koushki finds fascinating about Ibn Turka than “occult court simulator” or “alchemy career game.”

The FTL/DungeonAB machinery then becomes subordinate to that thesis:

FTL supplies the pressure and consequential encounters.

DungeonAB supplies capabilities, affordances, preparation, memory and emergent options.

The VN supplies historical specificity and character-driven decisions.

Koushki's scholarship supplies the actual intellectual engine.

And the research pipeline supplies an effectively inexhaustible stream of people, texts, concepts, diagrams, controversies, institutions and historical situations from which the game can construct encounters—without turning the game into a generic fantasy system. This last point is already consistent with the project's writing rule: every scene should reveal something specific about Ibn Turka's actual world rather than merely decorate an invented occult setting.

give me as many fun facts from the koushki research that can be used for worldbuilding our court politics and other interactions and choices
The most gameable Koushki facts

I’d treat these as a “worldbuilding deck”: each fact can become an NPC trait, court custom, encounter, faction, item, choice, rumor, research discovery, or systemic mechanic. I’m separating things directly about Ibn Turka from later material Koushki uses to illuminate the world he helped create.

Ibn Turka himself: stranger and more interesting than “court occultist”

His day job was Chief Judge of Isfahan. His occult-philosophical career wasn't a separate fantasy identity: the same person was a senior legal authority and an occult philosopher.

Game use: every court scene can have a double meaning. Someone isn't merely talking to “the magician”; they're talking to a judge whose rulings affect people's lives.

He was famous for defending the weak against the powerful. This becomes particularly important because his enemies eventually weaponized court politics against him.

Game use: give the player a recurring temptation to sacrifice judicial integrity for patronage.

He was simultaneously a humanist champion of the “Moderns” over the Ancients.

That's fantastic for characterization. Ibn Turka isn't merely preserving ancient wisdom. He can be the guy saying, in effect, the old authorities haven't gone far enough.

His masterwork Investigations was composed in 1420, at essentially the same moment that the Samarkand Observatory was being constructed.

Game use: 1420 can feel like a technological/intellectual “turn.” Books, astronomy, mathematics and imperial ambition are visibly accelerating simultaneously.

Koushki calls Investigations a landmark scientific manifesto, not merely an occult book.

Game use: writing the book should feel like launching a new intellectual technology.

Ibn Turka's project was based on the mathematization of the cosmos.

Game use: numbers aren't merely a skill. They are a way of seeing.

The project ultimately connects things as disparate as cosmology, poetry, architecture, armor, observational astronomy, music, mind-control magic and predictive computing in Koushki's account of its later ramifications.

This is probably the single best argument against making the game a narrow “magic simulator.” The player should continually discover that their theory has unexpected applications.

Cairo is where the weird intellectual network begins

Ibn Turka studied in Cairo under Sayyid Ḥusayn Akhlāṭī, described in the project research as a lettrist, alchemist and geomancer.

Game use: the opening shouldn't be “enter university.” It should be entering a city where someone can simultaneously be a scholar, occultist, alchemist and geomancer.

Akhlāṭī was sufficiently controversial that the project research calls him “infamous.” Public association with him was therefore itself a reputational calculation.

Encounter:

“The master has asked you to publicly identify yourself as his student.”

Choice:

Claim him proudly.
Study privately.
Deny the relationship.
Let others speculate.
Ibn Turka “traveled far and wide and sought out many authorities” before settling into his intellectual formation.

This makes travel itself part of the scholar career: you aren't leveling up by clicking “Study.”

Cairo functioned as a cosmopolitan intellectual hub linking Egypt, Iran, Anatolia and beyond. The New Brethren network later radiated across an enormous Persianate geography.

Game use: Cairo should feel like the place where someone can meet a scholar from an entirely different intellectual world at dinner.

The New Brethren weren't simply a formal school. Koushki describes them as an informal intellectual network of eminent scholars.

Game use: don't make them a guild with uniforms and headquarters. Make them a web of letters, friendships, teachers, patrons, manuscripts and shared vocabulary.

The New Brethren are excellent material for faction politics
Ibn Turka and his colleagues called themselves the Ikhwān al-Ṣafāʾ, consciously identifying with the older Brethren of Purity.

That's immediately fun. Imagine discovering that someone's apparently innocent scholarly circle is actually using an ancient, loaded name.

The New Brethren emerged around Mamluk Cairo around the turn of the fifteenth century.
Koushki characterizes Cairo as a kind of experimental testing ground for occult philosopher-kingship and court ritual.

That's almost a game setting by itself.

The network eventually stretched from the Mughal world to the Ottoman world.

Game use: your intellectual decisions can have consequences far beyond your current court.

Qāsim-i Anvar was one of Ibn Turka's Cairo companions. He was later exiled in 1427 for lettrist associations, just as Ibn Turka himself faced danger.

This gives you an excellent long-term relationship mechanic: the harmless-seeming friend from Act I becomes politically radioactive years later.

Qāsim-i Anvar's name means roughly “Distributor of Lights.”

That's a wonderful NPC detail. His name itself can become part of the game's symbolism and reputation system.

Ibn Turka's closest relationship with Sharaf al-Dīn Yazdī is unusually intimate in his surviving language: he calls him “my Brother in God.”

Don't make Yazdī merely an assistant. He should be the person with whom Ibn Turka can say things he would never say to a patron.

Yazdī later becomes an imperial historian and mathematician and works at the Samarkand Observatory.

That's a fantastic career arc for an NPC: friend → collaborator → court historian → architect of imperial memory.

Ibn Turka's intellectual choices are inherently political
Ibn Turka unusually insisted on putting Ibn ʿArabī and Saʿd al-Dīn Ḥamūya together as co-fathers of lettrism.

Game use: choosing which intellectual lineage to emphasize can affect different factions.

Hamuya is particularly interesting because his son reportedly played a role in the Mongol conversion to Islam through the gift of his father's talisman and robe. Koushki calls the connection “metahistorically” fitting.

That's a superb piece of court lore: an ancient talisman becomes part of the genealogy of imperial legitimacy.

Ibn Turka's lettrism treats Arabic letters as mathematically meaningful components of reality.
In Koushki's reading, the Qur'anic letters aren't merely symbols to interpret. They can be treated as part of a mathematical technology.
Ibn Turka associates Number with the highest key to reality and connects mathematically precise recitation of divine-name formulas to lettrist technology.

Game use: a player could discover that a seemingly mundane textual exercise has a second, occult interpretation.

The weirdest part is that grammar, numerology, Qur'anic interpretation, mathematics and cosmology aren't separate schools in this worldview.

This should radically influence the UI. A word, number, verse, diagram and astronomical event can all become nodes in the same investigation.

Court culture should be full of artists, not just “mages”
Iskandar Sultan's atelier is described in the game research as a place where astronomy, poetry and manuscript painting were fused.

This is a huge design opportunity.

Your court NPCs should include:

painters
calligraphers
poets
astronomers
mathematicians
manuscript designers
jurists
occultists

They should actually collaborate.

Bāysunghur was himself an accomplished calligrapher and likely commissioned the monumental Bāysunghur Qur'an.

Game use: a patron can personally care about typography, letterforms and manuscript production rather than merely “funding scholarship.”

A court commission might therefore involve how an idea looks, not just what it says.

“Should the cosmological theory be rendered as a diagram?”

“Which script?”

“Which colors?”

“Which verses?”

“Who gets to see the finished folio?”

Koushki's account explicitly treats manuscript form and literary style as part of the intellectual phenomenon. Ibn Turka is described as marrying Arabic/Persian literary style to science.

So writing beautifully isn't cosmetic. It can be a scholarly technology.

The Samarkand connection is enormous
Investigations and the construction of the Samarkand Observatory occur at essentially the same historical moment.
Yazdī worked at the Observatory.
Koushki describes the Samarkand Observatory as epochal and argues that Ibn Turka's intellectual project had major scientific and political impact in his own lifetime.
The star tables associated with the Samarkand project were extraordinarily accurate and, according to the project research, remained in use in London into the nineteenth century.

Game use: astronomy isn't a decorative “science skill.” It is an actual imperial infrastructure.

Yazdī is described as the first historian in the Arabic-Persian tradition to construct a fully astro-lettrist platform for imperial legitimacy.

This is one of the best mechanics in the entire research.

A historian doesn't merely record that the king won.

He can explain why the cosmos says the king was destined to win.

The ruler can literally be interpreted as a cosmic event
Yazdī paired analysis of a ruler's horoscope with lettrist analysis of names and historical events, especially Qur'anic passages and the mysterious Qur'anic letter groups.
Ibn Turka reportedly used the name of Shāhrukh to prognosticate that the Timurid state would endure through the entire ninth Islamic century.

This is fantastic as an encounter:

“The prince asks you how long his dynasty will last.”

You can answer through:

astrology
letters in his name
Qur'anic correspondences
political calculation
refusal to predict
Timurid legitimacy could therefore be constructed through a hybrid of history + astrology + lettrism.
Timur could be interpreted as a second Alexander, a Lord of Conjunction, and an embodiment of a metaphysical principle at the same time.

That's exactly how you make court propaganda feel intellectually strange rather than generic.

The Occult Court gets wonderfully weird
Koushki's later Occult Court article argues that the court is not merely a place where occultism happens.

“the Court is by cosmic definition Occult.”

That should practically be the Career Sim's loading-screen thesis.

Court culture could be organized around bazm u razm — “boozing and battling.” Koushki describes these as the Yin-Yang of Platonic-Pythagorean empire.

This gives you two radically different encounter modes:

BAZM

feast
poetry
drinking
music
spectacle
flirting
riddles
demonstrations
social manipulation

RAZM

war
hunting
campaigning
espionage
logistics
weapons
military magic

And the fun is that the same knowledge can sometimes work in both.

In the later Boon for the Khan, disappearing ink could serve as both party entertainment and intelligence technology.
Making a sleeping person reveal their secrets could be a party trick or interrogation technology.
Some tricks are explicitly intended to entertain and astonish guests.
Some seemingly absurd magic has military applications: ice candles, instant logs, hunting/fishing magic, etc.
Other operations are even stranger: giant flying soldiers and armies of smoke are described as explicitly military.

These are later examples, not Ibn Turka biography, but they're fantastic evidence for the kind of court culture Koushki is talking about.

The really important surprise: occultism could be funny
Koushki emphasizes wonder, weirdness and laughter as features of this intellectual culture.
Even ridiculous-looking tricks could be considered therapeutically useful because laughter itself was understood as medicine.
One example is literally a fart lamp.

This matters enormously for the game.

The occult court shouldn't feel like everyone whispers gravely in dark rooms.

It should occasionally be hilarious.

A serious philosopher can be asked to demonstrate an absurd trick at a feast.

A prince might laugh.

A rival might laugh harder.

A servant might secretly learn the trick.

Then six years later that same “party trick” turns out to have military or intelligence value.

That is a very FTL-like encounter structure.

“Magic” has a technology problem
In Boon for the Khan, ʿAlī Ṣafī deliberately excludes flying, instantaneous travel, invisibility and shapeshifting because he considers them scientifically unprovable or technologically impracticable.

That's a fantastic detail for your world.

The occult practitioner isn't necessarily someone who believes “anything is possible.”

He can be an experimentalist.

Encounter:

“A rival claims he can teleport a man across the city.”

Ibn Turka:

investigate the apparatus
demand reproducibility
expose the trick
attempt a controlled test
refuse to endorse it

That is much more interesting than “Magic = supernatural.”

Secrets versus popularization is a major political tension
The later occult manuals show a deliberate trend toward de-esotericization and democratization.
Kāshifī's project was explicitly oriented toward popularizing knowledge for a broad Persianate audience.
The Qasimian Secrets title itself plays on the tension between secret knowledge and distributing it.

This gives the Career Sim a superb recurring choice:

“Do you make this knowledge harder to understand so that only qualified people can use it?”

versus

“Do you simplify it so that it can spread?”

Neither is automatically correct.

The player can accidentally create a mass movement
The New Brethren's project was not just metaphysical; Koushki describes its reformulation of lettrism as universal science and theurgic technology.
Their influence reaches from metaphysics and physics to empire and empiricism, painting and architecture, astronomy and historiography, poetry and magic.

That's your “tech tree.”

A player might start by solving a philosophical problem and eventually discover:

“Why are painters using my cosmological diagrams?”

“Why is the army asking for my numerical tables?”

“Why is the prince's historian rewriting the dynasty according to my system?”

“Why are students across the country using my terminology?”

The player has accidentally created an intellectual movement.

The occult world can contain sectarian ambiguity
One of the most interesting later phenomena Koushki identifies is Sunni-Shiʿi confessional ambiguity in occultist circles.
ʿAlī Ṣafī, for example, is a Sunni Sufi whose works nevertheless exalt the Prophet's family as a model for the Islamic Occult Court.

This is excellent for court politics because it means the obvious faction labels don't always work.

An NPC might be:

Sunni in law

Shiʿi-inflected in symbolism

Sufi in affiliation

Pythagorean in philosophy

Occultist in practice

The player has to figure out which identity matters in this room, with these people, today.

A particularly good political mechanic: “translation”
Ibn Turka's system is not only about discovering truth; it's about making the system intelligible to different audiences.

Koushki's broader account of the New Brethren emphasizes the reformulation of lettrism as a universal science and its transmission through Persianate intellectual culture.

So every major idea could have several presentations:

Philosophical

Legal

Astrological

Poetic

Mathematical

Political

Popular

Same underlying idea, different rhetoric.

That could become one of the game's signature mechanics.

And then there is the spectacular failure state
Ibn Turka underwent three state inquisitions.
He successfully defended himself in the first two.
His third defense failed.
He then spent five years wandering in exile.
He died impoverished and in legal limbo.
According to the game's source-grounded choice design, his refusal to “bend the knee” during the inquisitions is the great dramatic constant.

This gives us the Career Sim's most important resource:

political capital is finite.

You can spend patron favor to survive one crisis.

You can spend reputation to win another.

But surviving doesn't reset the danger.

The historical arc suggests compounding political exposure.

The most fun possible court encounters I see emerging from this

These are the ones I'd put on the whiteboard immediately.

“The Prince Wants His Horoscope Explained.”

His astrologer gives one answer. His lettrist gives another. Ibn Turka can reconcile them—or embarrass someone.

“The Calligrapher Has Found a Pattern.”

A manuscript artist believes a particular arrangement of letters reveals a cosmological truth. Is this serious scholarship, artistic intuition, or dangerous nonsense?

“The Feast.”

A rival asks Ibn Turka to perform a harmless wonder in front of the court.

It works.

Too well.

Now everyone wants to know how.

“The Sleeping Secretary.”

Someone claims a technique can make a sleeping man reveal his secrets. Is it entertainment, medicine, magic, or espionage?

“The Disappearing Letter.”

A message vanishes after being written. The prince laughs. The intelligence chief stops laughing.

“The New Student.”

An unknown young scholar knows too much about the New Brethren. Is he a genuine disciple, an informer, or a rival?

“The Forbidden Teacher.”

Akhlāṭī asks you to defend him publicly.

“The Two Lineages.”

An argument erupts over Ibn ʿArabī versus Ḥamūya.

The historically Ibn-Turkian answer—both—pleases neither faction.

“The Historian's Problem.”

Yazdī wants to describe the ruler's victory as astrologically inevitable. Do you give him the lettrist argument?

“The Name of the Prince.”

A ruler's name contains a numerical pattern that appears extraordinarily auspicious.

Do you tell him?

“The Bad Number.”

The opposite happens.

“The Court Painter.”

She wants your cosmology to become an image.

You suddenly have to decide whether something esoteric should become public visual culture.

“The Judge's Dilemma.”

The defendant is accused of sorcery.

You know enough occult science to understand that the accusation may be nonsense.

But defending him may associate you with him.

“The Rival's Book.”

Someone has published a simplified version of your system and is becoming more popular than you.

Do you attack him, collaborate, or admit that he has made your ideas better?

“The Patron Wants Results.”

The prince doesn't care whether your theory is philosophically perfect.

He wants something useful.

“The Scholar Wants Purity.”

A scholar thinks adapting the science for court use corrupts it.

“The Soldier Wants a Trick.”

A seemingly ridiculous illusion might actually have battlefield applications.

“The Feast Turns Political.”

A drinking party becomes an intelligence operation without anyone formally declaring it one.

“The Joke Becomes Doctrine.”

A trick performed for laughter gets repeated until people begin believing it expresses a genuine occult principle.

“The Book Is Too Powerful.”

Your manuscript has become so popular that people outside your circle are using it.

Do you make the next edition harder to understand?

“The Court Wants Your Cosmology.”

The ruler wants your system incorporated into imperial ideology.

This is the ultimate career temptation.

“Your Friend Has Been Exiled.”

Qāsim-i Anvar disappears from the court.

Everyone advises you to distance yourself.

Your relationship from Cairo suddenly matters.

“The Second Inquisition.”

You can survive by sacrificing a friend.

“The Third Inquisition.”

You can survive by sacrificing the system.

Or refuse—and lose your career.

One thing I would especially steal for the game

Koushki's research makes me think the career sim shouldn't have a conventional “magic power” meter at all.

It should have something more like:

Synthesis — how much of the universal system you understand.

Demonstration — how convincingly you can make it work.

Patronage — who will fund/protect you.

Transmission — how widely the system circulates.

Authority — how legitimate different audiences consider you.

Exposure — how much political attention you've attracted.

Network — who will stand with you.

Legacy — how much of the system will survive independently of you.

Then the really good situations emerge from combinations:

High Synthesis + Low Demonstration = brilliant theorist nobody believes.

High Demonstration + Low Authority = spectacular trickster.

High Patronage + High Exposure = court favorite in danger.

High Transmission + Low Control = movement escaping its founder.

High Network + High Exposure = dangerous intellectual faction.

High Authority + Low Patronage = respected but poor.

High Everything + High Exposure = Ibn Turka problem.

And that last state is exactly what makes the career compelling: success itself becomes dangerous.

Koushki's Ibn Turka isn't interesting because he possesses secret powers. He's interesting because he appears to have discovered a way of connecting language, number, cosmos, law, history, politics, art, astronomy and occult practice—and then tried to make that system matter in the real world.

That gives us an unusually rich space for FTL-style encounters: every encounter can ask not merely “What spell do you cast?” but “Which part of your system do you reveal, to whom, and what happens when they believe you?”
