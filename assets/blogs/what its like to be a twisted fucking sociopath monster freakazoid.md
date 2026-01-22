So I've done something downright sick. And maybe vile. And maybe it might make you upset to read this... if you currently daily drive a Linux machine. Basically, I've concocted a plan to get as close to Linux as possible without actually switching to Linux. 

Why? Because I wish I could use Linux, but the UX just doesn't feel there yet.

I'm not a Windows fanboy by any means, but my laptop and desktop both run Windows 11. Its not that I like Windows 11! It's more like its the least bad of all options. I've tried Linux as a kid, Ubuntu was tough back then for a 12 year old. Recently, I tried Pop_OS!, because I heard that the distro is good for people who want a linux machine that "just works" out of the box. I ran into too many issues out of the box and stopped using it after a few weeks. There were too many issues to list, but a funny one was that the Pop! OS installer process kept freezing up. You know, the literally very first software you interact with after booting up with the USB stick that has the fresh OS on it.

Alas... I couldn't give up on the linux dream. I *know* that a free and fully open source operating system is the future. I know how awful Microsoft's privacy practices are, and more generally how hostile their attitude towards their own users. But I just... can't switch. Not yet at least. The level of jank is just too high still.


Here's what mattered to me and what I set out to get. It's also what I personally think of when I think of daily driving a good Linux machine. ✅ = I achieved it, 🤷🏻‍♂️ = I'm kinda getting there, 😩 = not yet:
- `bash` or a `bash-like` shell ✅
- A developer environment that mimics closely the servers/devices that I work on/with ✅
- An operating system that doesn't feel like it was designed by nervous beavers under a time crunch by their profit-seeking beaver bosses, racing to badly band-aid patch up a dam that was built by an earlier set of beavers equally nervous due to also trying to honor a previous time crunch set by a previous set of profit-seeking beaver managers  🤷🏻‍♂️
- A riced out GUI just like all the cool kids have these days 🤷🏻‍♂️
- A system that doesn't spy on me 😩
- A system that doesn't force content or software down my throat 😩

Here is what I tried, and what worked and what hasn't:

## WSL 2

I love WSL 2 so much. I am so happy this shit exists. The big boring secret of my setup is just using WSL 2 whenever possible. I get to hide in my little Ubuntu cave, just me and my penguin pal chilling in our own silly little hyper-v world. 
![pasted image 20251225165114](/assets/blogs/attachments/Pasted%20image%2020251225165114.png)
## GlazeWM and komorebi
This one is partly about visuals- I wanted to look cool and not run stock Windows. But also its about following this principle of adhering to the keyboard whenever possible. After working on a computer long enough you just realize that its faster to stay on keyboard as much as possible and use a mouse to "aim" and click as little as possible. It's kind of why vim is so popular, I think.

Anyways, both are tiling managers for Windows. Here's what [Glaze](https://github.com/glzr-io/glazewm) looks like:

![pasted image 20251226003605](/assets/blogs/attachments/Pasted%20image%2020251226003605.png)

Very cool ideas, beautiful when you look at the screenshots. Unfortunately they were both buggy or lacking in necessary features for me to adopt them. Glaze was quite close though, and I'm keeping my eye on it for the future. For now though, its better to just use Windows' built in desktop switcher (Ctrl + Win + Left/Right arrow or Win + Tab) as well as Windows' window moving key shortcuts (Win + Arrows).

And for aesthetics, I'm able to personalize my desktop nicely with Wallpaper Engine, so it feels curated to me.
## MSYS2 - Bash in Windows

Sometimes, you can't hide in WSL 2. Sometimes you gotta use raw Windows 11 to get your stuff done. For example, I'm currently working on a video game called *My New Computer* which needs to be developed in Windows to even run correctly (a lot of graphics related logic has issues going through WSL 2's layers).

And so, I've come to really enjoy MSYS2. I think it was originally made by people that wanted to build with unix logic/tooling but on Windows. I don't code in C and have no need for any of that. But I *do* want a setup that lets me learn just one shell and re-apply what I've learned everywhere. It's important to me out of principle that for my continued productivity and skills as a software engineer and programmer, I build off of what I've learned and become a power user of whatever I use. To meet that end, I need to focus on how much I'm going to learn. I don't want to learn semantics for bash, then zsh, then cmd, and finally powershell. Instead, I'd rather direct my energy towards getting closer to mastering just bash. MSYS2 lets me get one step closer in this goal. `ls`, `cat`,  `grep`, `sed`, `awk`, shell operators, etc- I wanted to be super comfortable with these fundamentals so I could move with efficiency.

All I had to do was:
1. Download and install
2. Set it as my preferred shell with profile info (in VS Code + in Windows 11's Terminal app, so both auto-open to it by launching the right program with the right arguments)
3. Configure my `.bashrc` to my liking (its a file that basically has all your profile preferences inside of your shell)
4. Set an env var: `MSYS2_PATH_TYPE` to `inherit`, so it just grabs all my windows PATH items right away.
5. Set an env var: `HOME` to `C:\Users\MyNameHere`, so it treats my actual Windows home directory (%USERPROFILE%) as my home dir instead of its own fake path. 
	- This way things like `cd ~` take you to your real home directory, and any programs that check for HOME find the real one where you actually store your keys, configurations, etc.

MSYS2 is cool and out of the box comes with most of the bash programs you're familiar with. 

Tip: use UCRT64, its the "default" recommended one by the maintainers.

Recommended reading: [What is MSYS2?](https://www.msys2.org/docs/what-is-msys2/)