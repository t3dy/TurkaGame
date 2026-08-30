// narrative.js — scene text and consequence flavor for all 40 choices.
// Static entries in CHOICE_TEXT/OPTION_CONSEQUENCE cover every choice; a handful of
// choices whose meaning genuinely changes based on earlier decisions are instead
// functions in CHOICE_TEXT_DYNAMIC(state) -> string, keyed the same way. main.js
// checks CHOICE_TEXT_DYNAMIC first and falls back to CHOICE_TEXT.

export const ACT_INTROS = {
  1: { title: 'Act I — Cairo & Formation', text: 'You have come to Cairo the way water finds a crack: because everywhere else was closed to you. The city is full of teachers. Most of them are wrong.' },
  2: { title: 'Act II — First Patron: Iskandar Sultan', text: 'A summons arrives, sealed and unhurried, the way princes write when they already expect yes. Iskandar Sultan is building a court where astronomers sit beside poets. You are being asked to sit somewhere in that room.' },
  3: { title: 'Act III — Second Patron: Bāysunghur', text: 'Fortune turns, as it does. You stand again before a Timurid prince, older now, your name worth something — though not yet worth enough to be safe.' },
  4: { title: 'Act IV — Choosing the Sciences', text: 'You have read enough, listened enough, argued enough. The five sciences lie open in front of you like five roads out of the same city. A life is not long enough to walk them all.' },
  5: { title: 'Act V — Popularizer or Secret-Keeper', text: 'The ideas exist now, whole, in your own hand. The question was never whether to write them down. It is who gets to read what you wrote.' },
  6: { title: 'Act VI — The Bench: Judge of Isfahan', text: 'By day you are not a philosopher. You are the Chief Judge of Isfahan, and the docket does not care what you were composing at dawn.' },
  7: { title: 'Act VII — Three Inquisitions', text: 'It was always going to come to this. Rivals do not forgive a reputation they cannot match. The tribunal is convened.' },
  8: { title: 'Act VIII — Exile & Legacy', text: 'Whatever happened in that room, it is behind you now. What is ahead is quieter, and in its own way harder: deciding what, if anything, outlives you.' },
};

export const CHOICE_TEXT = {
  c01: 'Half a dozen names circulate in the study-circles of Cairo, each with disciples who swear the others are frauds. You have limited time and less money. Somewhere in this city is a teacher worth following into real danger for — you just have to guess right before you can be sure.',
  c02: 'Sayyid Ḥusayn Akhlātī draws the kind of student who does not advertise the association afterward. He is called brilliant by the same people who call him dangerous, often in the same breath. Attaching your name to his is not a neutral act.',
  c03: 'Sharaf al-Dīn ʿAlī of Yazd listens the way few people do — not waiting for his turn to speak, but actually turning an idea over before handing it back sharper. You could keep him at the respectful distance a teacher keeps a promising student, or let him all the way in.',
  c04: 'Qāsim-i Anvār has the easy warmth of someone who has never yet had to choose between a friend and his own safety. You like him. You do not yet know what liking him will cost.',
  c05: 'Ibn ʿArabī\'s name opens doors and closes others just as fast; everyone has an opinion of the Andalusian mystic. Ḥamūya is quieter, less argued-over, and — you increasingly suspect — just as essential. No one before you has thought to need them both.',
  c06: 'The offer from Iskandar Sultan\'s court is generous, and generosity from princes is never free. Independence means going hungry on your own terms. Patronage means eating well on someone else\'s.',
  c07: 'Iskandar Sultan is young, curious, and not stupid — a dangerous combination in a patron, because he will notice if you are performing for him rather than teaching him. He asks what you actually believe.',
  c08: 'The atelier is loud with argument in the good way — poets borrowing astronomers\' diagrams, astronomers stealing poets\' metaphors. You could join the noise, or keep your work in the quieter room down the hall.',
  c09: 'A colleague has started repeating your ideas back to you at gatherings, half-credited, testing to see if you\'ll correct him in public. It is the first small skirmish of a war that has not been declared yet.',
  c10: 'Iskandar Sultan\'s star, so bright when you arrived, has begun to dim in the way princes\' stars do — slowly, and then all at once. Everyone at court is doing the math on when to leave.',
  c11: 'Bāysunghur receives you in a room lined with manuscripts he has personally commissioned; he is, by every account, a genuinely gifted calligrapher, prouder of that than of his princehood. You have one chance to decide what he remembers about this meeting.',
  c12: 'A Qur\'an unlike any yet produced is taking shape under Bāysunghur\'s patronage — a monument in vellum and gold leaf. Word reaches you that the calligraphers would welcome a numerological framework for the illumination program, if you cared to offer one.',
  c13: 'The Isfahan court\'s caseload does not know or care that you are in the middle of the most important work of your life. Petitioners still queue at dawn.',
  c14: 'Samarkand\'s observatory climbs toward the sky under Ulugh Beg\'s patronage, and Yazdi writes to you from inside it, giddy with star-tables no one has ever produced before. You could ask to be part of that formally. Or you could let the friendship carry what the institution won\'t.',
  c15: 'A rival scholar stands up at a gathering and challenges your framework directly, by name, in front of people whose opinions matter. The room waits to see if you\'ll answer now or later.',
  c16: 'The Occult Quintet is not a menu — it is closer to five separate lives, each demanding a lifetime of study to do honestly. Kīmiyā transforms matter. Līmiyā binds the heavens to the earth. Hīmiyā compels what does not want to be compelled. Sīmiyā shapes what people believe they see. Rīmiyā simply astonishes. Choose which life.',
  c17: 'Mastery of one science, deep and undiluted, is the historical path — and the harder one. Diversifying pays better, faster, and thinner.',
  c18: 'Cosmology without mathematics is poetry that happens to sound like science. Mathematics without cosmological ambition is just arithmetic. You need both eventually. You have to pick which one comes first.',
  c19: 'The new theory of the senses you have been developing overturns a hierarchy Avicenna himself never questioned. It is either the most important thing you will ever publish, or the fastest way to make yourself a target before you are ready for one.',
  c20: 'The Ṭahawī Circle — the diagram that summarizes everything you believe about the cosmos in a single figure — is nearly finished. Samarkand\'s observatory is rising at the same moment, and the timing will not go unnoticed either way.',
  c21: 'You could write Investigations the way it wants to be written — dense, demanding, built for readers willing to earn every page — or you could write something a wider court could actually follow. Both are honest choices. Only one is the one history remembers you making.',
  c22: 'The New Brethren of Purity — the name your circle chose for itself, consciously invoking the old Ikhwan al-Safa\' whose Rasa\'il once tried to gather all knowledge into one encyclopedia — keeps growing whether you plan for it or not. More students arrive each season, most of them earnest, a few of them clearly here to report back to someone. A wide brotherhood is influence. A small one is safety.',
  c23: 'An officer at court asks, diplomatically, whether a simplified Persian edition might do more good in the world than the Arabic masterwork alone. He is not wrong. He is also not entirely disinterested.',
  c24: 'A patron\'s steward arrives with a commission out of the popular grimoire tradition — the kind of thing \'Ali Safi will later call a Boon for the Khan: name the suffumigation that produces a convincing illusion, the rite that lets a sleeper be interrogated, the operation for dowsing buried treasure. Concrete, sellable, nothing like the grand system you\'ve been building. The money is real either way.',
  c25: 'Two names anchor everything you\'ve built: Ibn ʿArabī and Ḥamūya. You could credit them generously and let the debt show, or let your own name carry more of the weight than is strictly earned.',
  c26: 'The post of Chief Judge of Isfahan is offered — real income, real legal standing, and a second full-time life layered on top of the one you already have.',
  c27: 'A case comes before your bench that the whole city is watching: a powerful man\'s claim against a poor one, with the powerful man\'s friends already circling the courthouse.',
  c28: 'An argument in this case would move faster, and land harder, if you let your lettrist reasoning show in open court. No judge in living memory has tried it.',
  c29: 'The accused in this case practices something that looks, to an untrained eye, uncomfortably similar to your own scholarship. The eyes in this courtroom are not untrained.',
  c30: 'You will not have this much strength again. The bench offers steady legitimacy. The desk offers the work that might actually outlast you. You cannot fully serve both this year.',
  c31: 'The first inquisition convenes. Jealous colleagues have found a sympathetic ear at court, and now you have to answer for a life\'s work in front of people who have already half-decided against you.',
  c32: 'The tribunal offers a way out: a partial, face-saving recantation, phrased so everyone can pretend it wasn\'t one. It would make this go away faster.',
  c33: 'A second inquisition follows the first, and this time the tribunal wants names. Qāsim-i Anvār\'s is one of the names they are asking about.',
  c34: 'The third inquisition is not like the first two. The accusation is sharper, the patrons less reliable, and everyone in the room already knows this is the one that matters.',
  c35: 'A friend at court sends word before the summons arrives: there may still be a window to leave the city before this becomes official.',
  c36: 'Exile begins — five years of it, if the histories are right. The question is not whether you survive it, but what kind of life you build inside it.',
  c37: 'Even here, even now, the work does not stop wanting to be written. The only question is whether writing it is wisdom or a habit you can no longer break.',
  c38: 'Yazdi finds you in exile — loyal as ever, older now, still the best mind you have ever argued with. He asks, carefully, whether you mean to leave your papers to anyone, and whether he might be that anyone.',
  c39: 'However this ends, it is ending. You have time, at least, to choose the shape of it.',
  c40: 'Investigations is already, quietly, becoming the kind of book that gets copied less than it is talked about — respected by name, read by almost no one, the way difficult books go unfashionable long before anyone declares them so. Whatever you leave now, if anything, is what a reader centuries from now will eventually have to work with.',
};

export const CHOICE_TEXT_DYNAMIC = {
  c22: (state) => state.flags.c03 === 'equal'
    ? 'The New Brethren of Purity keep arriving, more each season. Yazdi — who you let all the way into the work — argues you should trust others the way you trusted him: the ideas got stronger for it, not weaker. A wide brotherhood is influence. A small one is safety.'
    : 'The New Brethren of Purity keep arriving, more each season. You have kept even Yazdi at a certain distance from the innermost work, and it has served you — no leaks, no distortions. But a system only one man fully holds is a system one death can erase. A wide brotherhood is influence. A small one is safety.',
  c27: (state) => state.flags.c09 === 'flaunt'
    ? 'A case comes before your bench that the whole city is watching: a powerful man\'s claim against a poor one. Your name is already loud — you made sure of that years ago — which means whichever way you rule, everyone will say it proves what they always suspected about you.'
    : 'A case comes before your bench that the whole city is watching: a powerful man\'s claim against a poor one. You have spent years keeping your name quiet, and it bought you this: for once, the ruling will be read as law, not as a philosopher\'s ambition. That makes it more dangerous, not less.',
  c34: (state) => {
    const total = Object.values(state.skills).reduce((a, b) => a + b, 0);
    const deep = total >= 7;
    return deep
      ? 'The third inquisition is not like the first two. The accusation is sharper, the patrons less reliable — and this time it is not just your name on trial but everything you have built: the years of study, the system, the science itself. They are asking you to renounce the work of a lifetime, and they know exactly what they are asking.'
      : 'The third inquisition is not like the first two. The accusation is sharper, the patrons less reliable, and everyone in the room already knows this is the one that matters. You kept your studies modest, which gives them less to burn — and you less to bargain with.';
  },
  c12: (state) => state.flags.c07 === 'full'
    ? 'A Qur\'an unlike any yet produced is taking shape under Bāysunghur\'s patronage. Because you never hid your full system from this court, the calligraphers already trust you enough to ask: would you offer a numerological framework for the illumination program?'
    : 'A Qur\'an unlike any yet produced is taking shape under Bāysunghur\'s patronage. You kept your full doctrine to yourself when you arrived at this court, and it shows — no one here has thought to ask you for anything more than competent legal counsel.',
  c31: (state) => state.flags.c10 === 'loyal'
    ? 'The first inquisition convenes. You stayed loyal to Iskandar Sultan through the lean years, and that loyalty is a debt someone at this court may still remember owing.'
    : 'The first inquisition convenes. You left Iskandar Sultan\'s falling star early enough to land somewhere safer — which means there is no old loyalty left to call in now that you need one.',
  c33: (state) => state.flags.c04 === 'deep'
    ? 'A second inquisition follows the first, and this time the tribunal wants names. Qāsim-i Anvār\'s is one of them — the friend you chose, back in Cairo, to bond with deeply rather than keep at arm\'s length. This will cost something either way.'
    : 'A second inquisition follows the first, and this time the tribunal wants names. Qāsim-i Anvār\'s is one of them — a man you always kept at a respectful, useful distance. Distancing yourself further now would barely need explaining.',
  c38: (state) => state.flags.c03 === 'equal'
    ? 'Yazdi finds you in exile — the same brother-in-arms you chose, in Cairo, to treat as an equal rather than a subordinate student. He knows this work as well as you do. He asks whether he might carry it forward.'
    : 'Yazdi finds you in exile — the loyal, capable student you kept, back in Cairo, at a mentor\'s respectful distance. He is willing to carry your papers forward, though he will be transmitting the letter of the work more than its deepest intentions.',
};

// Consequence lines that change based on EARLIER choices — this is where the
// state machine gets to talk. Checked before OPTION_CONSEQUENCE; return a string
// or null/undefined to fall through to the static line.
export const OPTION_CONSEQUENCE_DYNAMIC = {
  c31: {
    patron: (state) => state.flags.c10 === 'loyal'
      ? 'You call in the favor. Iskandar Sultan\'s people remember who stayed when the star was falling — and a word travels from that memory to this tribunal. Loyalty, it turns out, was an investment after all. It is now spent.'
      : null,
    both: (state) => state.flags.c10 === 'loyal'
      ? 'Law and loyalty at once — the argument on its merits, and the old debt called in behind it. It is the strongest defense a man can mount, and the most expensive: nothing you are owed survives this morning.'
      : null,
  },
  c33: {
    refuse: (state) => state.flags.c04 === 'deep'
      ? 'You refuse to give them Qāsim-i Anvār. He is not an associate; he is the friend you chose in Cairo, before any of this had stakes. The tribunal writes down your refusal. He will hear of it — and so will everyone deciding whether you are worth standing beside.'
      : 'You refuse to name anyone, on principle rather than affection — you never let Qāsim-i Anvār close enough for it to be more. The tribunal notes the refusal all the same. Principle, it turns out, reads the same as loyalty from the bench.',
    distance: (state) => state.flags.c04 === 'deep'
      ? 'You put distance between yourself and the man who was, for years, the nearest thing you had to a brother in this work. It may save you. He will learn what you said here, and there is no version of this where he learns it gently.'
      : null,
  },
  c38: {
    entrust: (state) => state.flags.c03 === 'equal'
      ? 'You hand Yazdi the papers, and it is not a bequest — it is the last move in a collaboration that started in Cairo. He knows this work almost as well as you do, because you let him. Nothing of it will be lost in his hands.'
      : 'You hand Yazdi the papers. He is loyal, careful, and capable — and he was always your student, never quite your partner. He will preserve every word faithfully. The parts of the work that lived only in conversation, in the room you never fully let him into, go with you.',
  },
};

export const OPTION_CONSEQUENCE = {
  c01: { scholastic: 'The madrasa disciplines your mind before it frees it. A slower start, a sturdier one.', unconventional: 'You skip the discipline and go straight for the strange teachers. Faster, riskier, and it shows in how you argue.' },
  c02: { public: 'People now know exactly whose student you are. Some respect it. Some are already keeping a file.', quiet: 'No one can prove the association yet. It costs you nothing today — and nothing, yet, in return.' },
  c03: { equal: 'Yazdi becomes something closer to a co-author than a student. It will matter later, in ways neither of you can see yet.', mentor: 'Yazdi remains devoted, capable, and slightly outside the innermost room where the real thinking happens.' },
  c04: { deep: 'You and Qāsim-i Anvār become the kind of friends who would vouch for each other under oath. That vow has not been tested yet.', distant: 'A warm, useful acquaintance — nothing that could be used against either of you, and nothing either of you could fully lean on.' },
  c05: { ibn_arabi: 'You lean into the more famous, more scrutinized half of your inheritance.', hamuya: 'You elevate the quieter tradition — a bolder claim, argued to fewer people who already agree with you.', both: 'You insist, as history records you did, on both traditions at once — pleasing neither camp\'s partisans and satisfying your own sense of what\'s true.' },
  c06: { accepted: 'You take the court appointment. Security, visibility, and a patron whose fortunes are now entangled with yours.', independent: 'You stay unaffiliated. No one owns your time — and no one is obligated to protect you either.' },
  c07: { full: 'The prince gets the real system, unabridged. He is impressed, and a little unsettled, and does not forget either reaction.', palatable: 'The prince gets a version built for a court audience. Safer. Also, quietly, less impressive.' },
  c08: { artist: 'You spend real time in the atelier, and the poets\' and painters\' instincts start showing up in your own diagrams.', separate: 'You keep to philosophy and law. Respected, a little apart, and entirely your own.' },
  c09: { flaunt: 'Your reputation grows fast — and so does the list of people keeping track of you.', cautious: 'You let the idea spread by word of mouth instead. Slower, and much harder to attack later.' },
  c10: { loyal: 'You stay through the downturn. If Iskandar Sultan remembers who left him and who didn\'t, you\'ll be the one who stayed.', early_defect: 'You quietly begin cultivating your next patron. Prudent — and it leaves nothing behind to call on later.' },
  c11: { calligraphy: 'You lead with a shared love of the manuscript arts. Bāysunghur warms to you immediately, prince to fellow craftsman.', astronomy: 'You lead with Samarkand\'s rising prestige. Bāysunghur is intrigued, if slightly more guarded than he\'d be with a fellow artist.' },
  c12: { collaborate: 'Your numerological framework becomes part of how this Qur\'an is illuminated — a quiet, permanent fingerprint on a monument.', separate: 'You keep your distance from a project this scrutinized. No fingerprint, no exposure either.' },
  c13: { formality: 'The docket gets thinner attention. Your philosophy gets the hours it needs — for now.', active: 'You stay a genuinely present judge even as your reputation as a philosopher grows. Exhausting. Also, later, useful.' },
  c14: { formal: 'You seek a real, documented tie to Samarkand\'s circle. It costs effort now and buys you standing later.', informal: 'You let the friendship with Yazdi carry the connection instead. Lighter, and entirely dependent on one relationship holding.' },
  c15: { immediate: 'You answer the challenge on the spot, in front of the same room that watched it happen. Decisive. Also irreversible.', delayed: 'You let it pass, for now. The rival reads your silence however he likes.' },
  c16: { kimiya: 'Kīmiyā — the most elite and demanding of the five. Slow, expensive, and unmistakably prestigious when it works.', limiya: 'Līmiyā — binding celestial forces to earthly ones. A discipline of careful correspondence.', himiya: 'Hīmiyā — the compelling of planets and of jinn. Power that answers, if you ask correctly.', simiya: 'Sīmiyā — the shaping of what other people see. Subtler than it sounds, and more dangerous.', rimiya: 'Rīmiyā — trickery, the most accessible science, and the fastest way to astonish a room.' },
  c17: { narrow: 'You commit to one science and let it define you completely — the historical path, and the harder one to walk back from.', diversify: 'You spread your study across several sciences. Steadier income. Never quite the deepest expert in the room.' },
  c18: { math_first: 'You build the mathematics first. Slower to impress anyone, but nothing you build afterward will rest on sand.', theurgy_first: 'You lead with the bold cosmological claims. Faster to dazzle a patron — and the math will have to catch up eventually.' },
  c19: { early: 'You publish the sensory theory now, while your name can barely carry the weight of it. Bold. Possibly premature.', hold: 'You hold it back until your reputation can absorb the shock of it. Patient. Possibly too patient.' },
  c20: { rush: 'You circulate the finished diagram alongside the observatory\'s own moment of prestige — maximum attention, minimum polish.', refine: 'You take the years the work actually needs. The Ṭahawī Circle, when it finally appears, is exactly as good as it should be.' },
  c21: { elite: 'You write the dense, demanding version — the one history remembers, and the one almost no one outside your circle can actually follow.', accessible: 'You write toward a wider readership, closer to what Kāshifī\'s generation will later perfect. More readers. Less mystique.' },
  c22: { wide: 'You teach broadly. The ideas start living in more heads than just your own — which means they can survive you.', small: 'You keep the New Brethren small and vetted. Safer to trust. Much easier to wipe out in a single afternoon.' },
  c23: { yes: 'A simplified Persian edition goes out into the world under your name, reaching further and faster than the Arabic ever could alone.', no: 'You refuse. The work stands at its full difficulty, or it doesn\'t stand for you at all.' },
  c24: { accept: 'You take the commission. The income is real, and so is the small dent in how seriously the work is taken.', decline: 'You decline, and protect the work\'s prestige at a cost you\'ll feel the next time rent is due.' },
  c25: { generous: 'You credit Ibn ʿArabī and Ḥamūya generously, debt fully visible. It costs you a little originality and buys you a great deal of goodwill.', overclaim: 'You let your own name carry more of the credit than is strictly earned. It reads well today. It is exactly the kind of thing a rival remembers later.' },
  c26: { accepted: 'You take the judgeship. A second career, a second reputation, and a second set of enemies to go with it.', declined: 'You decline, staying a scholar-only figure — purer, and considerably more precarious.' },
  c27: { powerful: 'You rule for the powerful man. Expedient. Quietly corrosive to the reputation you\'ve spent years building.', weak: 'You rule for the weaker party, at real political cost — the choice the histories actually remember you making.' },
  c28: { separate: 'You keep judge and occultist strictly apart. No one can accuse the bench of sorcery. No one benefits from the overlap either.', blended: 'You let lettrist reasoning shape the argument, in open court, for the first time anyone can recall. It works. It is also now on the record.' },
  c29: { mercy: 'You extend quiet solidarity to a fellow practitioner. Humane. Also a matter of public record, should anyone ever go looking for a pattern.', orthodoxy: 'You enforce the law strictly, distancing yourself from anything that could look like professional sympathy for the accused.' },
  c30: { bench: 'You give the year to the bench\'s legitimacy. Steady. The desk work waits.', writing: 'You give the year to the work at the height of your powers. The docket suffers. The philosophy does not.' },
  c31: { legal: 'You mount a rigorous legal defense on the merits alone. It is the harder case to make and the cleaner one to win.', patron: 'You call in the favor you\'re owed. Faster, and it spends something you may need again.', both: 'You attempt both at once — the strongest possible defense, and the hardest one to coordinate without a misstep.' },
  c32: { recant: 'You offer the face-saving recantation, phrased so carefully that everyone can pretend it was not one. The tribunal accepts it. Something in your own account of yourself does not, and you will hear that dissent, quietly, for years.', hold: 'You hold every position, without concession, in front of people who wanted you to bend. The room notes it. The men who convened this tribunal note it most of all — you have just taught them that the next one will have to be built differently.' },
  c33: { distance: 'You put visible distance between yourself and the associates now under suspicion. It may save you. It will not be forgotten by the people you distanced yourself from.', refuse: 'You refuse to abandon anyone, and accept the shared risk that comes with it.' },
  c34: { bend: 'You bend. The words come out of your mouth in the right order and the tribunal hears what it needs to hear. You survive this — diminished, your system publicly qualified, alive to argue another day. On the walk home you cannot remember deciding to say it. Only that you said it.', hold: 'You hold firm. The room goes very quiet, the way rooms do when a man chooses the expensive thing in front of witnesses. Whatever this costs from here — and it will cost everything the histories say it cost — it will not include the one thing they came here to take.' },
  c35: { flee: 'You take the window while it is still open. It is uncertain, undignified, and entirely survivable — three qualities that will define everything from here.', stand: 'You stand and face the tribunal directly, on your own name, without running. Whatever else is said of you afterward, no one will say you were not there.' },
  c36: { new_patron: 'You seek a new patron at a rival court, betting that your reputation still travels faster than the scandal that made you leave.', retreat: 'You retreat into private scholarship, no court, no patron, just the work and whatever time is left to do it in.', reconcile: 'You attempt reconciliation and the long, uncertain path back toward Isfahan.' },
  c37: { continue: 'You keep writing and teaching in exile — vulnerable, visible, and still producing.', silent: 'You go quiet, protecting what remains of the work and of yourself, at the cost of anything new.' },
  c38: { entrust: 'You hand Yazdi the papers — every draft, every diagram, the whole argument of a life. He takes them the way a man takes something he already knows he will spend the rest of his own life protecting. Whatever happens to you now, the work has somewhere to go.', keep: 'You keep the papers close. You tell yourself it is caution; some nights it feels more like not being able to let go. They will travel exactly as far as you do, and no further.' },
  c39: { peace: 'You make your peace with the cost of everything you chose. It does not undo any of it, and it does not need to. Of all the operations you ever mastered, this turns out to be the difficult one.', bitter: 'You go out railing against the men who did this to you, and you are not wrong to. But bitterness is a fire that burns in only one hearth, and it is yours.', defiant: 'You go out certain — genuinely, serenely certain — that history will eventually agree with you. It is either the greatest act of faith in your life or the most accurate prediction you ever made.' },
  c40: { public: 'You leave a public, unmistakable final word for the wider scholarly world to reckon with. Let them condemn it; condemnation is a form of copying.', quiet: 'You leave a quiet transmission for the New Brethren alone. No proclamation, no audience — just the work itself, passed hand to hand, small enough to survive.' },
};
