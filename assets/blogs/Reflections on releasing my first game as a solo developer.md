![920x430_v3](/assets/blogs/attachments/920x430_v3.png)

At 29 and after a little more than a year, I finally accomplished a long-standing dream of mine. I shipped a video game!!! It's a short story mystery with a bit of an experimental edge to it- it actually uses AI as a core game mechanic. Nope, not as an ancillary feature and not for development, the game centers around talking to AI characters through a chat app on your computer in order to progress through the story. It's called [*My New Computer*](https://store.steampowered.com/app/4130830/My_New_Computer/), and it's available on Steam or itch.io if you want to play it.

This post is a loose dev diary about what surprised me while actually shipping a solo game and why I'm so glad I stuck it out. I'll touch on topics like learning to control scope, perfectionism, and what it was like to wrangle LLMs together to act as characters for the game's experience. 

About a year ago, I came into this carrying a lot more self-doubt about my skills and competency. I had low confidence in my ability to deliver anything at all, let alone something fun that could grab people's attention for at least 30 minutes. Going through the process helped me grow, build confidence in my ability to execute on hard things, and just generally learn to trust and believe in myself more.

I'll drop some quick stats about my journey: 
- This is my 5th game I've ever started, and my 1st game to ever make it to the finish line
	- The first was a visual novel in Unity.
	- The second was a 2D platformer in Unity.
	- The third and fourth were LLM text adventures like [Zork](https://en.wikipedia.org/wiki/Zork). They both directly and iteratively inspired *My New Computer*.
- The game was 100% created by myself. I did use free, open content in my game with necessary permissions (for music and for some 3D assets) 
	- I did this sort of as a challenge to learn from and sort of to keep costs down for a project that I didn't know if I'd finish or not. The game's experimental nature meant that at any time I could just decide that it just wasn't good enough for anyone to play and therefore it should become game project #5 to go into the recycling bin.
	- My next game will definitely **not** be a single person endeavor. The next step for me is to start collaborating, for sure.
- I am entirely self-taught both in terms of game development and the uh... artistry you'll encounter when you play my game.
	- (there's a phrase in game dev circles called "programmer art", which refers to art made by someone who clearly isn't well versed at art and comes from a programmer background. That might be an applicable term for my situation too, though I hope my visuals/audio are charming!)
	- I should say I did go to school and work as a software engineer focusing mostly on backend though. So I have some tangential longstanding experience.
- All in all, my efforts took about 13 months (I started around November 2024)
	-  I spent about ~6 hours a week on average across those 13 months. I didn't record my time spent on the project, this is just a rough guesstimate. Many weeks I didn't touch it at all, while other weeks I spent upwards of 40 hours on it.

I've had some people ask me how I managed to release this game in an awe-inspired way which kind of sparks dread in me. The way they say it makes me think they really believe they can just start coding and pop something out after a year that is incredible with no prior experience, and that's just not how these things work. I learned this from studying the stories of successful indie devs like Toby Fox, who seemingly popped out of nowhere with *Undertale*, one of the most successful selling games of the 2010s. Toby actually got his start doing smaller deliverables like making ROM hacks for Earthbound where he got to practice telling his own stories and directing his own plot and designing his own characters while most of the art/assets were kinda already there thanks to being a derivative of a prior work, a Nintendo title. He also contributed to other projects/communities like Homestuck and built up experience that way too. To be honest, I think making a game as a solo indie dev is kind of a suicide mission if you're not highly skilled and ready for the emotional challenges of it. For me at least, it kinda felt like finishing some of the tutorial levels in Beat Saber and then just going straight to an Expert+ difficulty song.

![beat_saber](/assets/blogs/attachments/beat_saber.gif)

*OH GOD WHAT IS HAPPENING*

I hope I'm not making it sound awful. It wasn't, and I learned and grew a lot during this time. I just feel like I have to set these expectations anytime someone comes up and asks me how they can/should get into game development. There's a lot of 1AM moments staring at your screen in the dark, neck hurting because it's been hours sitting in the same position and you refuse to get up from your seat because shaders shouldn't be this fucking hard to figure out and god dammit I'm so close why won't it just do the ffuckginthing sdiufhsduigbjk

Oh, I've been saying "solo indie dev" a lot, I should clarify what I mean. For my journey:
- I wrote all code
- I did all the story writing
- I either hand-made all art in blender+three.js/paint.net/CSS+JS+HTML/image gen AI or I found free permissible assets online and hammered them into something usable for my game in blender 

Pretty much the only thing contributed were my lovely playtesters, who contributed their time and effort playing my game, sometimes many sessions, to give me feedback and help me understand where I was misaligned with player expectations.

I want to share some of the things I learned on this game dev road as well as some of the challenges encountered.

## Programming soft-skills/meta-skills
#### Knowing when to quit (or, how to stop overengineering)

Game dev kinda forces you to stop being a perfectionist. I still am, and that comes out more at my job at Troutwood where I work as a backend and AI Ops engineer, but I would argue that it makes more sense to be a stickler for quality at your organization, especially when you have your hands deep into as many critical backend services as I do at my company. In game development, it is very common to have throwaway scripts or code that you write once, and don't have to revisit pretty much ever. I learned pretty quickly to stop trying to refactor and make my code perfect, just get it to "good enough". What is good enough to me? I landed at:
- Bugs are rare enough that you can put off fixing the code until you get to a QA phase towards the end of development
- You could come back after a few months and understand it, its not total chickenscratch
- It isn't a security nightmare (I had to spend some time designing a robust backend that couldn't be abused either to steal API keys, or to spam my game with bad requests and waste my OpenRouter credits)

I noticed myself stopping pointless refactors more and more as I kept coding. No more for loops pointlessly refactored to be a list/dict comprehension, no adding low-value enhancements "just in case" they end up being helpful. Prototype, play first, then determine the merit that way. Do you really NEED to turn this file into one dataclass? How many of these things will you instantiate? The answer is usually that its *not worth it*. I let the game's needs naturally uncover as a result of playing the game and finding out where the flaws were from a player's perspective, and only addressed them when it was painfully obvious that the game couldn't work without the optimizations. For example, websocket logic would drop out and not resume where it left off at when reconnecting. This needed a rework, otherwise players would lose all their progress and the game would essentially soft-lock.

As I relaxed my stringent standards on code quality, I found that nothing bad happened. No FBI agents busted down my door and arrested me. No software developer influencers reacted to my codebase while live on twitch and derided me as the worst programmer ever alive. The world didn't end. I simply made good progress. And in the process I had more fun as I got to complete tasks and check them off my list faster, and start on new ideas quicker.

![pasted image 20251226005548](/assets/blogs/attachments/Pasted%20image%2020251226005548.png)
*it has 7 gorillion views and counting* 😢
## Using LLMs as a core experience/mechanic in a video game

I wanted to originally make this game and release it on Steam and itch.io for free. As a fledgling game dev, reaching a wider audience is way more important to me than trying to earn a few bucks by selling the game for a low price. But, chatting with AI characters as part of the core gameplay loop necessitates state of the art generative AI. I needed to bring in LLMs powerful enough to do the job right, or it wouldn't be worth playing.
#### Nano models (Small Language Models) are incredibly stupid and useless

I tried using SLMs for mostly internal tasks/work, not in-game, as I knew they were not a good fit right from the jump. But occasionally I would try to run an SLM for simple eval tasks like:

> Given the following text, determine their gender based off of the user's input and respond with ONLY one of the following: "MALE", "FEMALE", or "UNKNOWN".
> 
> USER: "im a guy"
> 
 > MODEL: "UNKNOWN"

This would be the result a solid 30% of the time. Seriously... 🙄
I realized pretty quickly that they are useless for about all tasks in my game, and abandoned them.

#### Mini models (~100b parameters) are surprisingly capable but weren't enough

It's worth pointing out that around this time, there weren't as many powerful open source LLMs to work with. I also wasn't too keen on using OpenRouter at the time because I had reliability concerns. For this reason I wanted to stick with proprietary and well established providers that had proven their worth like OpenAI and Anthropic. I went with OpenAI because I had more experience with their models and Anthropic's seemed to be the same roughly, just more expensive.

OpenAI's mini series of models were surprisingly good but couldn't "stay" convincing. They'd kick off scenarios well, but after enough chatting the holes would start to spring and the mistakes would appear. Models would hallucinate and forget important story beats. Minis would just lie about stuff they shouldn't lie about, like their current location in the game world. Models would confuse who they are with respect to other characters (dad would claim he is mom, or mom would claim that she is going to now come home which completely breaks the flow of the story and wrecks the plot).

Considering cost, I feared that if I released with gpt-4o or gpt-4.1 as the underlying model, this game would need to be like $7+ if I wanted to not burn my own money releasing a passion project. I decided to stick with the mini models despite their flaws. I turned desperately to finetuning, hoping that enough training examples could cover the gaps that mini-models had.
#### Finetuning mini models ended up not being worth it

Finetuning took so long, I probably burned about 2 months of effort researching and instrumenting a harness to basically let me run the game with GPT-4.1 as the roleplaying model, play through chats, collect conversations, and quickly touch them up when GPT-4.1 handled scenarios poorly and didn't act as the character should've. I would have a special hotkey (=) which when pressed and submitted basically said "Keep the last chat as a finetuning example, and if I have anything included with it, replace the AI reply with my desired response". This let me do something like:

> Dad: Gotta go, your mom wants to ask me something
> 
> Player: oh ok, sounds good
> 
> Dad: Hey bud, I think we're exhausted from this dinner. We're both thinking of coming home now.

At this point, I'd hit the hotkey and change it to something like "I'm thinking of coming home now", changing the "we" to "I" because the mother doesn't want to go home yet for story reasons and a chat reply like that from the dad would break the plot.

I also made mistakes like trying to encode game/world knowledge into finetuning data instead of covering that stuff in a more appropriate place like system prompting. After finishing, I had gpt-4.1-mini and gpt-4o-mini finetunes that were cost effective and appeared to work on the surface but suffered greatly when straying away from the happy path. I must have collected about 60-120 examples per character, or about 300 examples total. All manual, all handcrafted artisanal by yours truly. If those examples didn't cover what to do, the models could easily break. Worse, if the model didn't have finetuned data on the scenario it was in, it would hallucinate even worse than foundational models due to what happens to the weights during the post-training process. Finetuning basically lobotomizes the foundational models and replaces some of their weights with your crude examples which fail to generalize across scenarios better than the foundational model could. In other words, the models would tunnel vision hard. I understand why I got stuck for so long though- I trusted OpenAI's models and at the time the competitors weren't hitting that trifecta of affordable + reliable + intelligent models.

#### So... now what

With mini-models too weak, finetuning not working, and the premier large models being so expensive, I was starting to running out of options. I had this lingering fear that there was no way to actually deliver this game unless I either charged a ridiculous amount, or I pursued an unwieldy pay-to-play scheme such as making the game entirely free and then walling the game off until the user supplies their *own* API key for OpenAI or some similar provider.

Option A was immediately out because I knew at my experience level and scope I wasn't going to create a long and substantive enough experience worth paying $7+ to play. Irrespective of quality, my goal from the start was to deliver a short but fun experience that I could handle delivering all by myself. I capped myself at 2 hours max for the playtime (as of writing the game is about 45-90 minutes to play through). 

Times had changed, and the AI scene moves fast. By this point DeepSeek had released v3.1 of their MoE reasoning model. Kimi K2 and other similarly powerful open source models were out. I got over my irrational and unfounded hang-ups with OpenRouter and decided to look at prices + evaluate model abilities. I was blown away! I saw models almost as strong as GPT-5 but at 5-10x lower prices. I tuned my OpenRouter requests to filter out LLM providers who heavily compressed their models (anything more quantized than fp8/Q8, I rejected for fear of degraded roleplaying experience). I found through repeat testing that the API reliability was nowhere near as bad as I thought it would be. I tuned my server to handle retries and gracefully recover from repeat fails. My game code would convert these multi-try failures into an error message that convincingly fit in a desktop chat app.

Eventually I settled on *DeepSeek v3.2*, an LLM (~625b) with reasoning capabilities built in. Though I didn't end up using the reasoning capabilities. Instead I built out my own thinking step, sort of a mini-chain-of-thought. I identified common failure modes across the models roleplaying and created a think step where the model had to first always output its thoughts about how it was going to play its character well, and in there I had a sort of checklist for the model to go through. For example:

> What did the player's message likely mean? Are they breaking the fourth wall or "playing along", and how should your response follow guidelines considering that?
> What do I know about my character and my character's relationship to the player that would effect how I act when I text them back?


After all the evaluations, DeepSeek v3.2 appears to perform ~90-95% as well as OpenAI's gpt-5 model did, *but at the price of gpt-5-mini*. The decision was obvious by this point: I would switch to OpenRouter and rely mostly on DeepSeek with fallbacks set for other models. This allowed me to get the price of the game on release down to the one to two dollar range, a much closer fit for the game's length + quality. 

I rarely uncover catastrophic failures where the DeepSeek models fail to roleplay as their prescribed character, but I've mostly patched these instances out. Sometimes it's about asking the right question to stump the AI, like a question about the plot itself. The AI guesses or answers in conflict with the system prompting and its character sheet. I've learned how to plug up most of these holes so that the characters don't defy the plot. That's really more important than anything. I believe that part of the fun of chatting with AI characters is the randomness they inherently bring. I don't want to build 100% serious role-abiding characters. They can be goofy or weird at times, they can randomly clap back with zeal when you trash talk them or give them even the littlest of attitude, all that is a feature, not a bug. The only thing unacceptable is breaking the story or investigative aspects of the game. In *My New Computer*, the player needs to determine who to trust by chatting with the characters. If a reliable character starts acting unreliable or vice versa, that risks confusing the player into making the wrong judgement call. Ultimately, that means they get either the good ending and didn't deserve it and are therefore confused, or they get the bad ending and are confused and frustrated when they thought they did everything right.

#### LLMs driving the characters was quite a challenge
LLMs end up playing four different characters in my game, the rest of the cast are actually rudimentary canned text machines. There was mom and dad (self-explanatory), cosmo (your in-game canonical best friend), and arnold (sort of a side quest stranger you meet).

Making arnold was quite fun, I actually started and finished his character in its totality in just a week, whereas it took many months to tune the other characters just right. I got to make him quite late in the game's development and so I carried all the prior experience of what does and doesn't work with models of the same caliber as DeepSeek v3.2. It helped that he also has a lower responsibility in the game's world- he isn't related to the main story but rather exists as a sort of side quest to discover if the player feels like it. 

What really made him so much easier than the others could be summed up as **character consistency**. Mom, dad, and cosmo *know* who you are- they are your parents and best friend and to complicate matters more they know who each other are- or at least they're supposed to know each other. This meant that I needed to make sure they got their stories straight. I discovered so many failure modes from playtesting that clever playtesters thought of:
- Some players tried to ask if mom knew what dad's hair color was
- Some cross-checked things cosmo said about one of the parents to see if the parents also knew about it
- Some tried to ask for selfies to prove the person was where they claimed to be
- One player tried to bribe cosmo to forfeit a game of chess, which I never anticipated, so I never went through the effort of building out the ability for the AI characters to forfeit in chess

Over the year, I vibed out a strong system prompt through hundreds of play sessions, figuring out where the holes were in instruction following, plugging the leaks, switching models, and then discovering new holes because of that. If I could go back in time, I'd probably write a small bank of test cases that are basically simulated chat runs to monitor for LLM response regressions and similar issues.
## Using generative AI to make the game itself

Knowing that this game was going to be made entirely by me, a relatively inexperienced game developer, I knew that corners were going to be cut and constraints repeatedly enforced so that I could deliver something not in 50 years. I had so many ideas both in programming and art, and got really good at telling myself "Yes, X would be so cool but no, it's not gonna happen". Art both in the game and outside of it (like for promotional content, marketing, etc) would need to support a quick turnaround time so I could iterate on designs quickly. Even AAA studios need quick and iterative workflows to let them cycle through designs and land on the right one. But I felt that this was even more important for my situation because it was my first rodeo and I wasn't sure what directions to take. For example, a more seasoned dev/artist, who might have or hire someone with serious blender or drawing experience, may land much closer to bullseye in their first stab at it than I could. Knowing this, I often opted to use generative AI to come up with the less important art for my game.

#### Let's walk this line, **carefully**
If you're a fan of "thinky" type games (strategy + puzzle), you may have heard of [The Roottrees are Dead](https://store.steampowered.com/app/2754380/The_Roottrees_are_Dead/). It's a beautiful little puzzle game that originally released on itch.io in 2023 and then got remastered for a Steam release in 2025. The first release was made quickly (<1 year) using Midjourney generated art. It got the job done but didn't look that good, and had those iconic blemishes/mistakes we've learned to associate with bad AI generated art. Eventually the Steam release dropped the AI generated art once they had built up confidence that this game was going places. The dev teamed up with others and hired art help. 

I thought that this strategy of "Get started fast and cheap with AI art, replace later" was a perfect fit for me too, as an also unknown nobody game dev with limited resources. Release it cheap and fast and then see how well the idea fleshes out to your audience. If its successful, I could always swap out the art later and pay someone to make better art for me. I don't yet think I'm anywhere at that point yet. 

I kept telling myself that my goal was not to *hide that my art is AI generated, but make it look so good that people could see past it and enjoy my game for what it is.*

#### Examples
I'll let you be the judge of how well I did, but here are some of the AI generated assets for the game (all of these were gpt-image-1.5. Also worth keeping in mind that for most of these assets, you are viewing them far larger than they are ever displayed within Steam or itch.io):

*A Steam achievement for defeating Cosmo in a game of chess*:
![cosmo-defeated-achievement-icon](/assets/blogs/attachments/cosmo-defeated-achievement-icon.png)

*Original Vertical Steam Library Capsule Art (v1)*:

![mnccapsulevertical_600x900](/assets/blogs/attachments/MNCCapsuleVertical_600x900.jpg)

*After some iterating, current Vertical Steam Library Capsule art (v2) for the game*:

![heavydenoised_vertical_v2](/assets/blogs/attachments/heavydenoised_vertical_v2.png)



*Background ambience art that hides behind the store page*:
![page_bg](/assets/blogs/attachments/page_bg.png)

It helps a lot that none of the art I generated needed to sit front and center or fullscreened except for the hero.png (which is the big art that you see when you visit your game in the library):
![pasted image 20251225180416](/assets/blogs/attachments/Pasted%20image%2020251225180416.png)

This meant that I could get away with lots of small imperfections. This hero art is probably the most noticeable "AI smell" my game has (look at the keyboard).

I tried to hand make art where needed while also consciously designing my game so that art mattered as little as possible when producing it. When I couldn't avoid it, I used AI to keep costs down and simplify the process. I had also been mindful of the fact that using human made art isn't always a straight upgrade. Consider this [reddit thread](https://www.reddit.com/r/SoloDevelopment/comments/1kq5gzx/the_evolution_of_my_steam_capsules_from_fiverr_to/), where someone AI generated art better than the artist they commissioned to make art for their game (at least, according to the consensus in the comments). 

It's not that AI generated art being better than an artist's hand-made art is a common thing that happens at more than an outlier level. It's worth remembering that the art that we oft see is biased in a survivorship sort of way. Most of us don't see the 20th, 50th, or even 90th percentile art. In reality we end up consuming the top 1% most of the time in the games, movies, tv shows, and books that we enjoy. My takeaway was that just because I decide to allocate $500 towards a promo/marketing/logo art budget does not necessarily guarantee anything meeting or surpassing AI art quality. And in the process I would lose the benefits of AI generating art (pivot art direction quicker, shorter feedback time, more hands-on learning of art editing processes, all things that matter to me as a nascent game developer and really just a guy flexing my undertrained creative muscles).

Obviously, companies with hundreds of employees, indie studios (actually <10 people) and "indie" studios (<30 people that contracted out millions of dollars in hired help for QA, 3D/2D assets, sound, etc) should fucking pay real people who are talented and experienced. As a first time solo game developer, that route just wasn't a strong fit for me. 
#### How I was able to create promo art for my game rapidly and nearly free

I mostly stuck to:
- GPT-Image-1.5
- Nano Banana Pro
- Qwen Image Edit 2509 locally via ComfyUI

Out of those three, I used GPT-Image-1.5 the most, especially towards the end when finalizing. I noticed that before 1.5, AI image gens that I tried to iterate on would progressively degrade. They'd get more and more noisy and glitchy as I fed them back into the AI. 1.5 largely eliminates this thankfully, which really saved me and made it possible for me to make my promo/store art for basically nothing except the time and effort I put in designing them.

Nano Banana Pro seems sexy when you first try it, then you find out it has an insane amount of failure modes and if you stray off the path a little bit it quickly becomes inflexibly useless. Additionally: **dear god is google's ai studio so freaking bad.** It was a total roll of the dice whether it would cooperate with me that day or not. Some days I'd actually be able to generate, other days it would flash an error on your screen and refuse to output anything entirely. Additionally, you'd just log in and see that they ripped out 3 features you depended on and valued for seemingly no reason. I really hated using google's AI, I didn't feel that I could rely on it at all throughout development and by the end of my time with AI generated art I learned to treat it as a last resort.

## Final remarks
### Appreciating the makers, creators, and do-ers

Above all, making my own game and seeing it to the finish line really made me appreciate just how *hard* it is to make any piece of art intended for public consumption. I mean the sheer amount of work I have put in over this past year... just to make something... okay.  It's still difficult to imagine the amount of blood and sweat that accomplished game developers and artists have put in to the games they've made- But after undertaking this project, my eyes are a little more opened to a part of the human experience I didn't really ever peek at before.

Making my own game has definitely put pause in the art critic inside of me. Obviously if something sucks I'll still say that, but I have a newfound understanding and respect of just how hard it is to make something amazing or even just okay. Watching crappy 3/10 IMDB rated films hits a little different now... just a little.

_Whoa, you really made it this far? Wanna check out the game? 🙏🏻_
[Steam](https://store.steampowered.com/app/4130830/My_New_Computer/)
[itch.io](https://secondsave.itch.io/my-new-computer)