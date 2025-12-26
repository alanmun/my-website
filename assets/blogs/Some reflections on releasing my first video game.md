![920x430_v2](/assets/blogs/attachments/920x430_v2.png)

# Introduction
I am wrapping up on my 1.0.0 release of [*My New Computer*](https://store.steampowered.com/app/4130830/My_New_Computer/), a short and experimental mystery investigation game. I'll drop some quick stats about my story: 
- This is my 5th game I've ever started, and my 1st game to ever make it to the finish line
	- The first was a visual novel in Unity.
	- The second was a 2D platformer in Unity.
	- The third and fourth were LLM text adventures like [Zork](https://en.wikipedia.org/wiki/Zork). They both directly and iteratively inspired *My New Computer*.
- The game was 100% created by myself. I did use free, open content in my game with necessary permissions (for music and for some 3D assets) 
	- I did this sort of as a challenge, and sort of to keep costs down for a project that I didn't know if I'd finish or not. The game's experimental nature meant that at any time I could just decide that it just wasn't good enough for anyone to play and therefore it should become game project #5 to go into the recycling bin.
	- My next game will definitely **not** be a single person endeavor. The next step for me is to start collaborating, for sure.
- I am entirely self-taught both in terms of game development and the mediocre artistry you'll encounter when you play my game (there's a phrase in gamedev circles called "programmer art", it refers to art made by someone who clearly isn't well versed at art and comes from a programming background... yeah)
	- I did go to school and work as a software engineer focusing mostly on backend though. So I have adjacent longstanding experience.
- All in all, my efforts took about 13 months (I started around November 2024)
	-  I spent about ~6 hours a week on average across those 13 months. I didn't record my time spent on the project, this is just a rough guesstimate. Many weeks I didn't touch it at all, while other weeks I spent upwards of 40 hours on it.

# What I learned during this journey
## Programming soft-skills/meta-skills
#### knowing when to quit (or, how to stop overengineering)

Game dev kinda forces you to stop being a perfectionist. I still am, and that comes out more at my job at Troutwood where I work as a backend and AI Ops engineer, but the point I am trying to make here is that it makes sense this way. In game development, it is very common to have throwaway scripts or code that you write once, and don't have to revisit pretty much ever. I learned pretty quickly to stop trying to refactor and make my code perfect, just get it to "good enough". What is good enough to me? I landed at:
- Bugs are either nonexistent or rare enough that you can put off fixing the code until you get to a QA phase towards the end of development
- You could come back after a few months and understand it, its not total chickenscratch
- It isn't a security nightmare (I had to spend some time designing a robust backend that couldn't be abused either to steal API keys, or to spam my game with bad requests and waste my OpenRouter credits)

I noticed myself stopping pointless refactors more and more as I kept coding. No more for loops pointlessly refactored to be a list/dict comprehension, no adding low-value enhancements "just in case" they end up being helpful. Prototype, play first, then determine the merit that way. Do you really NEED to turn this file into one dataclass? How many of these things will you instantiate? The answer is usually that its *not worth it*. I let the game's needs naturally uncover as a result of playing the game and finding out where the flaws were from a player's perspective, and only addressed them when it was painfully obvious that the game couldn't work without the optimizations. For example, websocket logic would drop out and not resume where it left off at when reconnecting. This needed a rework, otherwise players would lose all their progress and the game would essentially soft-lock.

As I relaxed my stringent standards on code quality, I found that nothing bad happened. The world didn't end. No FBI agents busted down my door and arrested me. No software developer twitch streamers reacted to my codebase and derided me as the worst programmer ever alive. I just... made progress way faster :)

## Using LLMs as a core experience/mechanic in a video game
#### nano (SLM) models are incredibly stupid and useless

I tried using small language models for mostly internal tasks/work, not in-game. But occasionally I would try to run a small language model for simple things like:

> Given the following text, determine their gender based off of the user's input and respond with ONLY one of the following: "MALE", "FEMALE", or "UNKNOWN".
 USER: "im a guy"
 MODEL: "UNKNOWN"

Seriously?
I realized pretty quickly that they are useless for about all tasks.

#### mini models (~100b) are surprisingly capable but weren't enough

OpenAI's mini series of models were surprisingly good but couldn't "stay" convincing. They'd kick off scenarios well, but after enough chatting the holes would start to spring and the mistakes would appear. Models would hallucinate and forget important story details. Models would just lie about stuff they shouldn't lie about. Models would confuse who they are with respect to other characters (dad would claim he is mom, or mom would claim that she is going to do X which completely breaks the flow of the story and wrecks the plot).

Considering cost, and how this game would need to be like $7+ if I wanted to release with gpt-4o or gpt-4.1 as the underlying model, I decided to stick with the mini models despite their flaws, hoping finetuning could cover the gap.
#### finetuning wasn't worth it

Finetuning took so long, I probably burned about 2 months of effort researching and instrumenting a harness to basically let me run the game with GPT-4.1 as the roleplaying model, play through chats, collect conversations, and quickly touch them up when GPT-4.1 handled scenarios poorly and didn't act as the character should've. I also made mistakes like trying to encode game/world knowledge into finetuning data instead of covering that stuff in a more appropriate place like system prompting. After finishing, I had gpt-4.1-mini and gpt-4o-mini finetunes that were cost effective and appeared to work on the surface but suffered greatly when straying away from the happy path. I must have collected about 60-120 examples per character, or about 300 examples total. All manual, all handcrafted artisanal by yours truly. If those examples didn't cover what to do, the models could easily break. Worse, if the model didn't have finetuned data on the scenario it was in, it would hallucinate even worse than foundational models due to the finetuning process. It basically lobotomizes the foundational models and replaces some of their weights with your crude examples which fail to generalize across scenarios better than the foundational model could. I understand why I got stuck for so long though- I trusted OpenAI's models and at the time the competitors weren't putting out affordable but still powerful models.

#### So... what then?
I wanted to originally make this game and release it on Steam and itch.io for free. As a fledgling game dev, reaching a wider audience is way more important to me than trying to earn a few bucks by selling the game for a low price. But, chatting with AI characters as part of the core gameplay loop necessitates state of the art generative AI. I needed to bring in LLMs powerful enough to do the job right, or it wouldn't be worth playing.

I settled on DeepSeek v3.2, an LLM (~625b) with reasoning capabilities built in. Though I didn't end up using the reasoning capabilities. Instead I built out my own thinking step, sort of a mini-chain-of-thought. I identified common failure modes across the models roleplaying and created a think step where the model had to first always output its thoughts about how it was going to play its character well, and in there I had a sort of checklist for the model to go through. For example:

> What did the player's message likely mean? Are they breaking the fourth wall or "playing along", and how should your response follow guidelines considering that?
> What do I know about my character and my character's relationship to the player that would effect how I act when I text them back?


In the end, DeepSeek v3.2 appears to perform ~90-95% as well as OpenAI's gpt-5 model did, *but at the price of gpt-5-mini*. The decision was obvious by this point. Switch to OpenRouter and rely mostly on DeepSeek with fallbacks set for other models.
## Using generative AI to make the game itself

Knowing that this game was going to be made entirely by me, I knew that corners were going to be cut all over the place. Art both in the game and outside of it (like for promotional content, marketing, etc) would need to be done cheaply and support a quick turnaround time so I could iterate on designs quickly. Of course, even AAA studios need quick and iterative workflows to let them cycle through designs and land on the right one. But for me it was especially important since it was my first rodeo and I wasn't sure what directions to take. A more seasoned person, who is actually an artist, may land much closer to bullseye in their first stab at it than I could. Knowing this, I opted to use generative AI to come up with my art.

#### Inspirations and motivations
You may have heard of [The Roottrees are Dead](https://store.steampowered.com/app/2754380/The_Roottrees_are_Dead/). It's a beautiful little puzzle game that originally released on itch.io in 2023 and then got remastered for a Steam release in 2025. The first release was made quickly (<1 year) using Midjourney generated art. It got the job done but didn't look that good, and had those iconic blemishes we've learned to associate with AI generated art. Eventually the remastering dropped the AI generated art once they had built up confidence that this game was going places. I thought that this was a perfect fit for my strategy too, as an also unknown nobody game dev with limited resources. Release it cheap and fast and then see how well the idea fleshes out to your audience. If its successful, I could always swap out the art later and pay someone to make better art for me.

#### how I was able to create promo art for my game rapidly and nearly free

I mostly stuck to:
- GPT-Image-1.5
- Nano Banana Pro
- Qwen Image Edit 2509 locally via ComfyUI

Out of those three, I used GPT-Image-1.5 the most, especially towards the end when finalizing. I noticed that before 1.5, AI image gens that I tried to iterate on would progressively degrade. They'd get more and more noisy and glitchy as I fed them back into the AI. 1.5 largely eliminates this thankfully, which really saved me and made it possible for me to make my promo/store art for basically nothing except the time and effort I put in designing them.

Nano Banana Pro seems so sexy when you first try it, then you find out it has an insane amount of failure modes and if you stray off the path a little bit it quickly becomes inflexibly useless. Additionally, **JESUS H. CHRIST IS GOOGLE'S AI CHAT UI SO BAD.** It was a total roll of the dice whether it would cooperate with me that day or not. Some days I'd actually be able to generate, other days it would fail entirely. You'd also just log in and see that they ripped out 3 features you depended on and valued for seemingly no reason. I really hated using google's AI, I didn't feel that I could rely on it at all.

Overall, my goal was not to *hide that my art is AI generated, but make it look so good that people could see past it and enjoy my game for what it is.*

I'll let you be the judge of how well I did, but here are some of the AI art I made for the game (all of these were gpt-image-1.5):

*An achievement for defeating Cosmo in a game of chess*:
![cosmo-defeated-achievement-icon](/assets/blogs/attachments/cosmo-defeated-achievement-icon.png)

*Original Vertical Steam Library Capsule Art (v1)*:
![mnccapsulevertical_600x900](/assets/blogs/attachments/MNCCapsuleVertical_600x900.jpg)

*Current Vertical Steam Library Capsule art (v2) for the game*:
![heavydenoised_vertical_v2](/assets/blogs/attachments/heavydenoised_vertical_v2.png)

*Background ambience art that hides behind the store page*:
![page_bg](/assets/blogs/attachments/page_bg.png)

It helps a lot that none of the art I AI generated needed to sit front and center except for the hero.png (which is the big art that you see when you visit your game in the library):
![pasted image 20251225180416](/assets/blogs/attachments/Pasted%20image%2020251225180416.png)

This meant that I could get away with lots of small imperfections. This hero art is probably the most noticeable "AI smell" my game has (look at the keyboard).

I tried to hand make art where needed while designing my game so that art mattered as little as possible when producing it. When I couldn't avoid it, I used AI to keep costs down and simplify the process. I had also heard of people getting burned by human artists. Consider this [reddit thread](https://www.reddit.com/r/SoloDevelopment/comments/1kq5gzx/the_evolution_of_my_steam_capsules_from_fiverr_to/), where someone AI generated art better than the artist they commissioned to make art for their game (at least, according to the consensus in the comments). I'm not saying that's a common thing that happens, but I just wanted to make the case that turning to AI isn't always a straight downgrade. The art that we see is biased in a survivorship sort of way where most of us don't see the 20th, 50th, or even 90th percentile art, we really see the top 1% most of the time in the games, movies, tv shows, and books that we consume.

## Final remarks
### Appreciating the makers, creators, and do-ers

Above all, making my own game and seeing it to the finish line really made me appreciate just how *hard* it is to make any art intended for public consumption. Just the sheer amount of work I have put in... just to make something mediocre. I can't fully imagine how hard people like Daniel Mullins, Jonathan Blow, or Garry Newman have worked to make the games they've made and to have the impact they've had over the years, but I think I can start to fathom it after undertaking this project.

Making my own game has definitely put pause in the video game, or really art in general, critic inside of me. Obviously if something sucks ass I'll still say that, but I have a newfound understanding of just how hard it is to make something that's good or even just sucks a little butt.




_Whoa, you really made it this far? Wanna check out the game?_
[Steam](https://store.steampowered.com/app/4130830/My_New_Computer/)
[itch.io](https://secondsave.itch.io/my-new-computer)