export function getComparisonMessage(userCm: number, pokemonName: string, pokeHeightM: number): string {
  const userM = (userCm / 100).toFixed(2);
  const pokeM = pokeHeightM.toFixed(1);
  const pokeCm = (pokeHeightM * 100).toFixed(0);
  const ratio = pokeHeightM / (userCm / 100);
  let name = pokemonName.replace(/<[^>]*>/g, '');
  name = name.charAt(0).toUpperCase() + name.slice(1);
  const diffCm = Math.round(Math.abs(pokeHeightM - (userCm / 100)) * 100);

  type MsgFn = () => string;

  const absurdTall = [
    "Whoa, over 2 meters? Are you from the Netherlands or something? Anyway...",
    "Are you secretly a basketball player? Because wow...",
    "Wait, you're actually that tall? Did you make a typo? Regardless...",
    "Are you sure you don't have a pituitary gland issue? Just kidding, but...",
    "Over 200cm? You might actually be a Pokémon yourself! But...",
    "Hold on, are you standing on someone's shoulders? Well, assuming you're not...",
    "You're built like a Machamp! Do you have unusually long limbs? Anyway...",
    "At over 2 meters, you're in the top 1% of the population! Let's see...",
    "Typo alert? Or are you just incredibly tall? Either way...",
    "Are you sure you didn't accidentally enter your weight? Just kidding...",
    "Wow, you're up there in the clouds! Breathing that thin air...",
    "Are you an NBA prospect or did your finger slip on the keyboard? Let's see...",
    "Over 2 meters! Are you part Alolan Exeggutor? Anyway...",
    "That's a towering height! Do you bump your head on doorways a lot? Regardless...",
    "You must face everyday challenges finding clothes! Let's compare...",
    "Is that your real height or a natural biological variation? Well...",
    "Goodness, you're tall! Are you sure you're not a Dynamaxed human? Anyway...",
    "Over 200cm? You definitely have tall genetics. So...",
    "Did you drink a Max Elixir? That's unbelievably tall! But...",
    "Are you sure you don't have Marfan syndrome? If you don't, wow! Anyway..."
  ];

  const absurdShort = [
    "Wait, under 1 meter? Are you a baby playing with a Pokédex? Anyway...",
    "Are you typing from a crib? Because that's really tiny! Let's see...",
    "Are you sure you didn't put your height in inches by mistake? If not...",
    "You're smaller than a lot of unevolved Pokémon! Are you a toddler? Well...",
    "Hold on, are you a Joltik in disguise? That's remarkably short! Anyway...",
    "Did you shrink in the wash? Or maybe a typo? Regardless...",
    "Are you actually an infant, or did your cat walk across the keyboard? Let's assume...",
    "Under 100cm? You must be great at hide-and-seek! So...",
    "Did a psychic Pokémon shrink you? You are incredibly small! But...",
    "Are you a garden gnome? That height is suspiciously low... Anyway...",
    "Typo detected? Or are you just a literal baby genius coding on a Pokédex? Well...",
    "That's incredibly tiny! Are you sure you didn't measure your foot? Let's see...",
    "Wow, you're pocket-sized yourself! Assuming that's not a typo...",
    "Are you sure you aren't a Pichu using a smartphone? Either way...",
    "You must be saving a ton of money on clothes! Anyway...",
    "Did you mean to type a larger number? If you really are that small...",
    "You're practically microscopic! Did a wizard curse you? Well...",
    "At that height, you could ride on a Pidgey's back! So...",
    "Are you a fairy type in disguise? That's extremely short! But...",
    "Wait, did you accidentally type your pet's height? Assuming it's yours..."
  ];

  const impossibleTall = [
    "Over 3 meters? You're literally as tall as an elephant! Assuming you're not lying...",
    "Are you a tree? Because humans don't get this tall. Anyway...",
    "Did you measure yourself in millimeters by mistake? Regardless...",
    "Okay, now you're just making numbers up. But let's pretend...",
    "Are you a Dynamaxed human? Because that's physically impossible. Still...",
    "You'd have to duck to look at streetlights! Assuming you're telling the truth...",
    "Are you three kids in a trench coat? Even then, that's pushing it! But...",
    "I think your tape measure is broken! Let's play along though...",
    "You must be a cryptid! Bigfoots aren't even that tall. Anyway...",
    "That's not a human height, that's a building story! But okay...",
    "Are you an alien? Because humans max out way below that. Let's see...",
    "You could practically step over cars! Nice try, but let's compare...",
    "Okay, Godzilla, let's see how you stack up anyway...",
    "Did you drink an entire barrel of Max Elixir? Unlikely, but...",
    "You're taller than most standard ceilings! If you insist...",
    "Is this a joke? Because you're claiming to be the size of a dinosaur. Anyway...",
    "I didn't know the Abominable Snowman used this app! Let's pretend...",
    "You're literally off the human charts! But just for fun...",
    "That height is biologically impossible for a human! But okay, science fiction...",
    "Are you a transformer? Because wow. Let's see anyway..."
  ];

  const godTierTall = [
    "Okay, now you're just typing random numbers. You're taller than a four-story building! I'm not even going to compare you to a Pokémon.",
    "Over 10 meters? Yeah, right. Go find a Kaiju to compare yourself with, not a Pokémon.",
    "Are you the Eiffel Tower? Because that's the only way this makes sense. Comparison cancelled!",
    "Error: Human height not found. You've officially reached atmospheric levels of lying.",
    "Nice try! At that height, you could use a Snorlax as a footrest. Come back with a real number!",
    "Are you trying to reach the moon? Because you're well on your way. I can't even process this.",
    "You're so tall, your head is in orbit! I think you broke the measuring tape.",
    "I'm a Pokédex, not an astronomical telescope. Please enter a valid human height!",
    "Is your name Godzilla? Because that's the only creature this tall. Not doing the math!",
    "You're literally taller than most legendary Pokémon! What do you want me to say?",
    "At this point, you're not a person, you're a geography feature. Let's be real.",
    "Look, if you're really that tall, you should be worried about airplanes, not Pokémon!",
    "That's it, I'm calling a scientist. This height is completely fake!",
    "You're bigger than a Wailord! I refuse to indulge this fantasy any further.",
    "Congratulations, you found the keyboard! Now try typing your *actual* height.",
    "I think you added a few too many zeros there, boss. Try again!",
    "Are you a mountain? Because I only compare Pokémon to humans, not landmasses.",
    "I would tell you how much taller you are, but I ran out of numbers. Try a realistic height!",
    "You're so huge, you could probably eat this Pokémon in one bite. Comparison aborted!",
    "If you were really this tall, you wouldn't be using a smartphone, you'd be using a billboard."
  ];

  let prefix = "";
  
  if (userCm > 1000) {
    return godTierTall[Math.floor(Math.random() * godTierTall.length)];
  } else if (userCm > 300) {
    prefix = impossibleTall[Math.floor(Math.random() * impossibleTall.length)];
  } else if (userCm >= 200) {
    prefix = absurdTall[Math.floor(Math.random() * absurdTall.length)];
  } else if (userCm < 100) {
    prefix = absurdShort[Math.floor(Math.random() * absurdShort.length)];
  }

  const colossal: MsgFn[] = [
    () => `${name} is absolutely colossal — ${pokeM}m tall! You'd barely reach its ankle. It's ${diffCm}cm taller than you.`,
    () => `At ${pokeM}m, ${name} would cast a shadow over an entire building. You are just a speck at ${userM}m!`,
    () => `Looking up at ${name} (${pokeM}m) would hurt your neck! It towers over you by an unbelievable ${diffCm}cm.`,
    () => `You'd need a telescope to see ${name}'s face! It's an astronomical ${diffCm}cm taller than you.`,
    () => `An absolute titan! ${name} is ${pokeM}m tall, making it a staggering ${diffCm}cm taller than your tiny ${userM}m frame.`,
    () => `If ${name} stood next to you, you'd look like an action figure. It beats you by ${diffCm}cm!`,
    () => `At ${pokeM}m, ${name} is a walking skyscraper. You're looking at a ${diffCm}cm height gap!`,
    () => `${name} is so massive (${pokeM}m) it probably has its own weather system up there. You're ${diffCm}cm shorter!`,
    () => `You're ${userM}m. ${name} is ${pokeM}m. You'd need a very tall ladder just to give it a high-five!`,
    () => `Behemoth alert! ${name} is ${diffCm}cm taller than you. Watch out where it steps!`,
    () => `Towering at ${pokeM}m, ${name} makes you look like a pebble. A truly gigantic ${diffCm}cm difference!`,
    () => `It's hard to comprehend how huge ${name} is until you realize it's ${diffCm}cm taller than your ${userM}m height!`,
    () => `${name} belongs in a kaiju movie! At ${pokeM}m, it absolutely dwarfs your ${userM}m stature.`,
    () => `You could practically live inside one of ${name}'s footprints! It's a whopping ${diffCm}cm taller.`,
    () => `Don't get stepped on! ${name} is an earth-shaking ${pokeM}m tall — a full ${diffCm}cm above you.`,
    () => `Staring up at ${name} from your ${userM}m vantage point, you're faced with a ${diffCm}cm wall of Pokémon!`,
    () => `You are literally a fraction of ${name}'s size. It's ${pokeM}m tall, beating you by ${diffCm}cm!`,
    () => `With a height of ${pokeM}m, ${name} is the definition of gargantuan. You're ${diffCm}cm shorter!`,
    () => `${name} is a majestic giant at ${pokeM}m. You'd need wings to get a good look at its face!`,
    () => `You'd be nothing more than a speed bump to ${name}. It's an overwhelming ${diffCm}cm taller than you!`
  ];

  const giant: MsgFn[] = [
    () => `${name} towers over you at ${pokeM}m. You'd definitely want to stay out of its way — it's ${diffCm}cm taller!`,
    () => `Standing next to ${name}, you'd feel like a miniature figure. That's a massive ${diffCm}cm difference in height!`,
    () => `At ${pokeM}m, ${name} could easily use you as an armrest. You're looking at a ${diffCm}cm height gap.`,
    () => `You are ${userM}m. ${name} is ${pokeM}m. Let's just say you wouldn't win in a game of basketball.`,
    () => `${name} is a hulking ${pokeM}m tall. You're completely overshadowed by its ${diffCm}cm advantage!`,
    () => `You'd have to shout for ${name} to hear you up there! It's a huge ${diffCm}cm taller than you.`,
    () => `That's one massive Pokémon! ${name} stands at ${pokeM}m, beating your ${userM}m by a long shot.`,
    () => `You could probably hide behind ${name}'s leg. It's an imposing ${diffCm}cm taller than you!`,
    () => `At ${pokeM}m, ${name} is an absolute unit. You are ${diffCm}cm shorter!`,
    () => `If you were sitting on someone's shoulders, you *might* look ${name} in the eye. It's ${diffCm}cm taller!`,
    () => `${name} is ${pokeM}m of pure intimidation. You've got a ${diffCm}cm height deficit here.`,
    () => `You'd feel incredibly small standing next to a ${pokeM}m ${name}. It has ${diffCm}cm on you!`,
    () => `A monumental Pokémon! ${name} makes your ${userM}m height look insignificant with its ${diffCm}cm lead.`,
    () => `You'd need a serious growth spurt to catch up to ${name}'s ${pokeM}m height!`,
    () => `${name} is looking down on you from ${pokeM}m high. That's a solid ${diffCm}cm difference!`,
    () => `It's safe to say ${name} is the big spoon. It's ${diffCm}cm taller than you!`,
    () => `With a height of ${pokeM}m, ${name} is undeniably huge. You're trailing by ${diffCm}cm.`,
    () => `${name} is a towering presence at ${pokeM}m. You'd better hope it's friendly!`,
    () => `You are definitely the underdog here! ${name} is a formidable ${diffCm}cm taller than you.`,
    () => `At ${pokeM}m, ${name} is basically a living wall compared to your ${userM}m frame.`
  ];

  const veryTall: MsgFn[] = [
    () => `${name} is noticeably taller at ${pokeM}m — you'd be looking straight up by ${diffCm}cm.`,
    () => `At ${pokeM}m vs your ${userM}m, ${name} has ${diffCm}cm on you. It's got serious presence!`,
    () => `You'd feel pretty short standing next to ${name}. It beats your height by a solid ${diffCm}cm.`,
    () => `Measuring in at ${pokeM}m, ${name} would easily look right over your head.`,
    () => `You're ${userM}m, but ${name} is a solid ${pokeM}m. It's a commanding ${diffCm}cm taller.`,
    () => `${name} is tall enough that you'd definitely want it on your volleyball team! (${diffCm}cm taller)`,
    () => `A respectable height advantage for ${name}! It stands at ${pokeM}m, ${diffCm}cm above you.`,
    () => `You'd have to crane your neck slightly to talk to ${name}. It's ${diffCm}cm taller!`,
    () => `At ${pokeM}m, ${name} is quite a bit larger than you. A cool ${diffCm}cm difference.`,
    () => `${name} is built like a center at ${pokeM}m. You're looking at a ${diffCm}cm height gap.`,
    () => `You definitely wouldn't want to get in ${name}'s way! It's a sturdy ${diffCm}cm taller than you.`,
    () => `${name} stands a proud ${pokeM}m tall, making you the shorter one by ${diffCm}cm.`,
    () => `You're looking up to ${name} in more ways than one! It's ${diffCm}cm taller.`,
    () => `With ${diffCm}cm on you, ${name} (${pokeM}m) is an imposing but manageable size.`,
    () => `${name} is distinctly taller at ${pokeM}m. You'd definitely feel the ${diffCm}cm difference!`,
    () => `At ${pokeM}m, ${name} is a tall drink of water. You're ${diffCm}cm shorter!`,
    () => `You've got a ${diffCm}cm height disadvantage against ${name}'s ${pokeM}m frame.`,
    () => `${name} is solidly in the "tall" category compared to your ${userM}m!`,
    () => `It's a clear win for ${name} in the height department, beating you by ${diffCm}cm.`,
    () => `You'd make a great sidekick to ${name}'s ${pokeM}m stature!`
  ];

  const slightlyTaller: MsgFn[] = [
    () => `${name} (${pokeM}m) is just a bit taller than you — only ${diffCm}cm more. Almost eye level!`,
    () => `You're remarkably close in height! ${name} edges you out by just ${diffCm}cm at ${pokeM}m.`,
    () => `At ${pokeM}m, ${name} could probably borrow your clothes, though it's ${diffCm}cm taller.`,
    () => `You'd have to look up just slightly to meet ${name}'s gaze. A respectable ${diffCm}cm difference.`,
    () => `${name} is ${pokeM}m, just barely beating your ${userM}m. A very friendly height difference!`,
    () => `You are almost exactly the same size, but ${name} has a slight ${diffCm}cm edge!`,
    () => `Only ${diffCm}cm separates you and ${name}. You'd make a great duo!`,
    () => `At ${pokeM}m, ${name} is the perfect height to rest its chin on your head!`,
    () => `${name} is just a smidge taller than you at ${pokeM}m.`,
    () => `You're looking at a very close match! ${name} is just ${diffCm}cm taller.`,
    () => `If you wore platform shoes, you'd be exactly as tall as ${name} (${pokeM}m)!`,
    () => `${name} (${pokeM}m) is just tall enough to reach the top shelf for you.`,
    () => `A very relatable size! ${name} is only ${diffCm}cm taller than your ${userM}m.`,
    () => `You and ${name} are in the same weight class, even if it is ${diffCm}cm taller.`,
    () => `At ${pokeM}m, ${name} is comfortably close to your own height.`,
    () => `Just a ${diffCm}cm difference! ${name} is the perfect size for a sparring partner.`,
    () => `${name} slightly edges you out at ${pokeM}m. A very natural pairing!`,
    () => `You wouldn't have to strain your neck to look at ${name} (${pokeM}m).`,
    () => `With only ${diffCm}cm between you, ${name} is a very manageable size!`,
    () => `${name} is ${pokeM}m — a height you can easily see eye-to-eye with, almost.`
  ];

  const sameHeight: MsgFn[] = [
    () => `You and ${name} are practically the same height! At ${pokeM}m, you'd see perfectly eye-to-eye.`,
    () => `${name} is ${pokeM}m and you're ${userM}m — only ${diffCm}cm apart. The perfect sparring partner size!`,
    () => `It's a tie! Well, almost. With only ${diffCm}cm between you, you and ${name} are a perfect match.`,
    () => `At ${pokeM}m, ${name} is exactly your height class. High-five material!`,
    () => `You could look ${name} right in the eyes! You are separated by a mere ${diffCm}cm.`,
    () => `Twins! ${name} is ${pokeM}m, making you basically identical in height.`,
    () => `An absolute perfect match! You and ${name} are only ${diffCm}cm apart.`,
    () => `You and ${name} (${pokeM}m) are on the exact same level.`,
    () => `It doesn't get much closer than this! A tiny ${diffCm}cm difference between you and ${name}.`,
    () => `You're ${userM}m, ${name} is ${pokeM}m. You are height buddies!`,
    () => `If you were a Pokémon, you'd be ${name}'s size. Only ${diffCm}cm difference!`,
    () => `You and ${name} are walking shoulder-to-shoulder at ${pokeM}m!`,
    () => `A perfectly balanced friendship! You and ${name} are virtually the same height.`,
    () => `No height advantage here! You and ${name} (${pokeM}m) are an even match.`,
    () => `You'd look great standing next to ${name}. Only ${diffCm}cm between you two!`,
    () => `At ${pokeM}m, ${name} is your absolute size equivalent.`,
    () => `You and ${name} are sharing the same airspace! A minuscule ${diffCm}cm difference.`,
    () => `You are basically the human version of ${name} when it comes to height!`,
    () => `A fantastic size match! ${name} is a very relatable ${pokeM}m.`,
    () => `With only ${diffCm}cm separating you, ${name} is the perfect companion size!`
  ];

  const waistHeight: MsgFn[] = [
    () => `At ${pokeM}m, ${name} comes up to around your waist. It's ${diffCm}cm shorter — a perfect companion to walk beside.`,
    () => `${name} is a comfortable ${pokeM}m. You'd look down at it by ${diffCm}cm. Great size for head-pats!`,
    () => `You have a clear height advantage! ${name} is ${diffCm}cm shorter than you at ${pokeM}m.`,
    () => `Measuring ${pokeM}m, ${name} is just the right size to walk right alongside you like a loyal dog.`,
    () => `${name} is a very manageable ${pokeM}m. You're the taller one by ${diffCm}cm!`,
    () => `You'd definitely be the one reaching the top shelf for ${name} (${pokeM}m).`,
    () => `At ${pokeM}m, ${name} is a great medium size. It's ${diffCm}cm shorter than you.`,
    () => `You could easily rest your arm on ${name}'s head! It's ${diffCm}cm shorter.`,
    () => `${name} (${pokeM}m) is the perfect size for a hug! You've got ${diffCm}cm on it.`,
    () => `A very friendly height! ${name} is ${pokeM}m, making you ${diffCm}cm taller.`,
    () => `You are significantly taller than ${name} (${pokeM}m). A solid ${diffCm}cm difference.`,
    () => `${name} would make a great walking buddy at ${pokeM}m.`,
    () => `You're looking down at ${name} by ${diffCm}cm! It's a modest ${pokeM}m tall.`,
    () => `At ${pokeM}m, ${name} is right in that sweet spot between small and large.`,
    () => `${name} is a very pet-able size! It's ${diffCm}cm shorter than your ${userM}m.`,
    () => `You're the big boss here! ${name} is only ${pokeM}m tall.`,
    () => `With a ${diffCm}cm advantage, you definitely tower over ${name} (${pokeM}m).`,
    () => `${name} is perfectly sized to be your trusty sidekick at ${pokeM}m.`,
    () => `You'd have to bend down slightly to talk to ${name} (${pokeM}m).`,
    () => `At ${pokeM}m, ${name} is a wonderful, unintimidating size compared to you!`
  ];

  const kneeHeight: MsgFn[] = [
    () => `${name} is quite small at ${pokeM}m! It would barely reach your knees — ${diffCm}cm shorter.`,
    () => `Only ${pokeM}m tall, ${name} could comfortably ride in your backpack. It's ${diffCm}cm shorter than you!`,
    () => `You'd need to crouch down to say hello to ${name}, who measures a modest ${pokeM}m.`,
    () => `At ${pokeM}m, ${name} is definitely ankle-biting height. You've got ${diffCm}cm on it!`,
    () => `${name} is a little cutie at just ${pokeM}m. You are overwhelmingly taller by ${diffCm}cm!`,
    () => `You could easily carry ${name} around! It's only ${pokeM}m tall.`,
    () => `At ${pokeM}m, ${name} is perfectly sized for sitting on your lap.`,
    () => `You are a giant compared to ${name}! It's ${diffCm}cm shorter than you.`,
    () => `${name} is a pint-sized ${pokeM}m. You're towering over it!`,
    () => `Watch your step! ${name} is only ${pokeM}m tall down there.`,
    () => `You'd make a great jungle gym for ${name} (${pokeM}m)!`,
    () => `At ${pokeM}m, ${name} is adorably small compared to your ${userM}m.`,
    () => `${name} is ${diffCm}cm shorter than you. A truly bite-sized Pokémon at ${pokeM}m!`,
    () => `You could pick ${name} up with ease! It's only ${pokeM}m tall.`,
    () => `A very smol ${name}! It stands at a mere ${pokeM}m.`,
    () => `You are looking way down at ${name}. It's a cute ${diffCm}cm shorter than you!`,
    () => `${name} (${pokeM}m) is the perfect size to cuddle like a teddy bear.`,
    () => `You're practically a skyscraper to ${name}, who is only ${pokeM}m tall!`,
    () => `At ${pokeM}m, ${name} is just a little knee-hugger.`,
    () => `Such a tiny friend! ${name} is ${diffCm}cm shorter than you at ${pokeM}m.`
  ];

  const tiny: MsgFn[] = [
    () => `${name} is incredibly tiny at just ${pokeCm}cm! It could easily sit on your palm.`,
    () => `At only ${pokeCm}cm, ${name} is completely pocket-sized! Watch where you step.`,
    () => `You are a whopping ${diffCm}cm taller! ${name} is practically microscopic at ${pokeCm}cm.`,
    () => `Measuring just ${pokeCm}cm, ${name} could perch right on your shoulder with room to spare.`,
    () => `${name} is so small (${pokeCm}cm) you might lose it in the grass! You're ${diffCm}cm taller.`,
    () => `An absolute speck! ${name} is only ${pokeCm}cm tall. Handle with care!`,
    () => `You could fit ${name} in your pocket. It's a minuscule ${pokeCm}cm tall!`,
    () => `At ${pokeCm}cm, ${name} is smaller than most of your shoes.`,
    () => `You are basically a god to ${name}, towering over it by ${diffCm}cm!`,
    () => `${name} (${pokeCm}cm) is delightfully tiny! It could sleep in a teacup.`,
    () => `A truly microscopic Pokémon! ${name} is only ${pokeCm}cm tall.`,
    () => `You'd need a magnifying glass for ${name}! It's an adorable ${pokeCm}cm.`,
    () => `At ${pokeCm}cm, ${name} is lighter than a feather and smaller than your hand.`,
    () => `${name} is an incredibly small ${pokeCm}cm. Don't let it blow away!`,
    () => `You are ${userM}m. ${name} is ${pokeCm}cm. The size difference is staggering!`,
    () => `${name} is a literal bug-sized Pokémon at ${pokeCm}cm!`,
    () => `You could wear ${name} as a hat! It's only ${pokeCm}cm tall.`,
    () => `At ${pokeCm}cm, ${name} is one of the smallest Pokémon out there!`,
    () => `Such an itty-bitty Pokémon! ${name} is a mere ${pokeCm}cm.`,
    () => `${name} (${pokeCm}cm) is so small it makes you feel like a giant!`
  ];

  let baseMsg = "";
  if (ratio > 5) baseMsg = colossal[Math.floor(Math.random() * colossal.length)]();
  else if (ratio > 3) baseMsg = giant[Math.floor(Math.random() * giant.length)]();
  else if (ratio > 1.5) baseMsg = veryTall[Math.floor(Math.random() * veryTall.length)]();
  else if (ratio > 1.1) baseMsg = slightlyTaller[Math.floor(Math.random() * slightlyTaller.length)]();
  else if (ratio >= 0.9) baseMsg = sameHeight[Math.floor(Math.random() * sameHeight.length)]();
  else if (ratio > 0.5) baseMsg = waistHeight[Math.floor(Math.random() * waistHeight.length)]();
  else if (ratio > 0.2) baseMsg = kneeHeight[Math.floor(Math.random() * kneeHeight.length)]();
  else baseMsg = tiny[Math.floor(Math.random() * tiny.length)]();

  return prefix ? `${prefix.trim()} ${baseMsg}` : baseMsg;
}
