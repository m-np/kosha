# How to Use Kosha as Your Second Brain

> A practical guide to capturing, connecting, and retrieving knowledge with the PARA method.

---

## The Core Idea

Your brain is for having ideas, not holding them. Kosha is where ideas live once you've had them. The goal is to offload everything worth keeping — notes from meetings, half-formed thoughts, reference material, plans — so your working memory stays clear.

Two principles drive the system:

**Capture everything, organize later.** When something comes in, get it into Kosha immediately. Don't stop to decide where it belongs. You can always move it. The cost of a misplaced note is low; the cost of a lost thought is high.

**Link aggressively.** Knowledge compounds when notes connect to each other. A standalone note is a dead end. A note that links to three others is a node in a network. Over time your graph becomes a map of how your mind works.

---

## The PARA Folders — What Goes Where

```
Projects   → things you are actively working on right now
Areas      → ongoing responsibilities you maintain indefinitely
Resources  → topics you want to learn about or reference later
Archive    → anything that is done, paused, or no longer relevant
```

### Projects

A project has a **clear outcome** and a **deadline** (even a fuzzy one). If you can't state what "done" looks like, it belongs in Areas, not Projects.

| Examples |
|----------|
| Launch redesigned portfolio by June |
| Read and annotate *Thinking Fast and Slow* |
| Write Q2 performance review |
| Set up Kosha second brain |

Keep Projects short and active. If you haven't touched a note in two weeks and there's no urgent deadline, move it to Archive. You can always move it back.

### Areas

An area has a **standard to maintain** over time, not a finish line.

| Examples |
|----------|
| Health (workout log, diet notes, doctor visits) |
| Finance (budget notes, investment ideas, tax records) |
| Work (role responsibilities, 1-on-1 notes, career goals) |
| Learning (reading list, course notes, study plans) |
| Home (repair notes, appliance manuals, renovation ideas) |

Notes in Areas evolve slowly. You add to them as things happen, and they become a running log of your life.

### Resources

A resource is a topic you find interesting, regardless of whether it connects to a current project.

| Examples |
|----------|
| Productivity methods (PARA, Zettelkasten, GTD) |
| Book notes and summaries |
| Recipes |
| Programming patterns |
| Design inspiration |

Don't overthink what goes here. If you read something interesting and want to be able to find it again, it's a Resource.

### Archive

Everything goes here eventually. Move notes to Archive when:
- A project is finished or cancelled
- An area is no longer relevant to your life
- A resource feels stale or you've extracted what you needed

Archive is not the trash. It's cold storage. Full-text search works across it, and wikilinks still resolve. Things in Archive are findable — they're just not cluttering your active workspace.

---

## Your Daily Workflow

### Morning — Set Your Intention (5 minutes)

Create a Daily Note using the template:

1. Press **⌘N** (or click **+ Template**)
2. Choose **daily-note** template
3. Name it today's date: `2026-05-29`
4. Put it in **Areas** (under something like "Daily Notes")
5. Fill in your **Top 3 Priorities** for the day

Your daily note is your anchor. Everything that happens today gets captured here first.

```markdown
# 2026-05-29

## Top 3 Priorities
- [ ] Finish the API design doc for auth service
- [ ] 1-on-1 with Priya at 3pm
- [ ] 30-minute run

## Capture
> Drop anything here as it comes up throughout the day.

- Interesting idea from standup: could cache the token at the edge layer
- Book recommendation: *A Mind for Numbers* — from Priya

## Learned Today
- Redis sorted sets are better than lists for leaderboard use cases

## Related Notes
[[Auth Service Design]]

## Reflection
What went well? The API discussion moved fast once we had a diagram.
What would I change? Should have time-boxed the architecture debate.
```

### Throughout the Day — Capture Without Friction

Anything that comes up goes into the Capture section of your daily note or straight into a dedicated note if it warrants one. The key: **don't stop to organize**. Write it down, link it if you know the related note, and move on.

Later — during a break or at end of day — scan your captures and decide:
- Is this a task for a project? Open the project note and add it.
- Is this reference material? Move it to Resources.
- Is it done? Archive the daily note at end of week.

### Evening — Process Your Captures (10 minutes)

1. Open today's daily note
2. For each capture, decide: **does this belong in a specific note?**
3. Move content to the right place (copy/paste, then add a wikilink back)
4. Check off the priorities that are done
5. Write a two-sentence reflection

This loop — capture during the day, process in the evening — is the heartbeat of the system.

---

## Working With Notes

### Creating a Note

**Quick note:** `⌘N` → type name → pick folder → Create

**From template:** Click **+ Template** → choose template → name it → Create

**From the sidebar:** Hover over a folder name → click the **+** that appears

### Writing With Wikilinks

Wikilinks are the connective tissue of your second brain. Wrap any note name in double brackets:

```
I've been thinking about [[Deep Work]] a lot since reading [[Cal Newport Summary]].
This connects to my current [[Writing Practice]] project.
```

When you type `[[`, start typing a note name. In the split preview, wikilinks render as clickable spans — click one to jump to that note instantly.

**Rules for good wikilinks:**
- Use the exact note name (case-sensitive, matches the file name)
- Link early and often — don't wait for the "right" moment
- If the linked note doesn't exist yet, create it later; the link will still be there

### The Split Preview

Toggle split view with **⌘⇧P** or the **⇥** button in the top bar.

Left side: raw Markdown you're writing.
Right side: live-rendered preview.

This is especially useful when your note has a lot of structure — checklists, headings, blockquotes. You see both representations at once and neither gets in the way.

### Autosave

Kosha saves 1.2 seconds after your last keystroke. The indicator in the top-right corner shows:

- *(blank)* — no unsaved changes
- `saving…` — debounce running
- `saved ✓` — written to disk (fades after 2s)

You can also force-save anytime with **⌘S**.

### Renaming and Moving Notes

**Rename:** Change the title field at the top of the editor. The file is renamed on disk the next time the note saves.

**Move to a different folder:** Use the folder dropdown next to the title. The note moves on disk immediately and the sidebar updates.

---

## The Graph View

Click the **Graph** tab (or switch with the tab buttons at the top).

Every note is a node. Every `[[wikilink]]` between notes is an edge. Nodes are colored by folder and sized by number of connections.

**What the graph tells you:**
- Highly connected nodes are your **hub notes** — key ideas or projects that many things relate to
- Isolated nodes are **orphans** — notes that haven't been linked yet, candidates for connection or archiving
- Clusters reveal **topic groups** you didn't consciously design

**Interacting with the graph:**
- **Drag** any node to reposition it
- **Scroll** to zoom in and out
- **Click** any node to open that note in the editor

Use the graph as a weekly "health check" for your knowledge base. Are there orphan notes that should connect to something? Are there two clusters that should have a bridge note?

---

## Search

Press **⌘K** to focus the search box from anywhere.

Results show:
- Note name
- Folder (color-coded)
- The matching line from the note content

Search covers every note in every folder, including Archive. So even old notes are findable.

**Tip:** Search is your fallback when you can't remember where you put something. Don't waste mental energy maintaining a perfect folder taxonomy — let search rescue misplaced notes.

---

## Templates in Practice

### Daily Note

Use every day as your capture surface and intention-setter. File them in Areas under a "Daily Notes" note, or just let them accumulate in Areas. Search finds them by date.

### Project Note

Create one when you start any project. Fill in:
- **Goal** — the one-sentence outcome
- **Deadline** — even a rough month is useful
- **Tasks** — the next few concrete actions (not an exhaustive list)
- **Resources** — wikilink to any reference notes

Update the Notes Log section as work progresses. When the project is done, fill in the Done section and move the note to Archive.

### Meeting Note

Create one per significant meeting. Before the meeting: fill in Agenda. During: take notes and action items. After: link it from your daily note (`[[1-on-1 with Priya 2026-05-29]]`) and from the relevant project note.

---

## Linking Strategies

### The Daily Note as Hub

Your daily note is naturally the hub for everything that happened that day. Always link from your daily note to any note you touched or created.

```markdown
## Related Notes
[[Auth Service Design]] [[Priya 1-on-1 2026-05-29]] [[Redis Leaderboard Pattern]]
```

### Index Notes

For broad topics, create an index note that links to everything in that topic. Example:

```markdown
# Programming Notes Index

## Architecture
- [[Microservices vs Monolith]]
- [[Event-Driven Design]]
- [[Auth Service Design]]

## Performance
- [[Redis Leaderboard Pattern]]
- [[Database Indexing Notes]]
```

This becomes a navigable map of a subject area. Link to it from resource notes. Watch it grow in the graph as the cluster fills in.

### The Evergreen Note

Some notes are worth refining over time rather than just appending to. When you return to a topic, update the note in place — don't create a new one. The goal is a small number of dense, well-linked notes rather than hundreds of stubs.

---

## Weekly Review (20 minutes)

Once a week — Friday afternoon or Sunday evening — do a short review:

1. **Empty your daily notes.** Scan all daily notes from the week. Move orphaned captures to the right place. Archive the daily notes themselves.

2. **Update your projects.** Open each active Project note. Cross off completed tasks, add new ones. Move finished projects to Archive.

3. **Check the graph.** Are there orphan nodes that should link to something? Any obvious clusters that want a hub note?

4. **Trim Areas.** If an area note is getting long, extract the old content into a named note and link to it.

5. **Clear Archive anxiety.** If a note has been sitting in Projects for two weeks with no activity, be honest: is this really active? Move it to Archive.

The weekly review is where the system compounds. Each review makes next week's capture and retrieval slightly easier.

---

## Example: A Real Note Network

Here's what a small, real knowledge network might look like after a month of use:

```
[Areas/Health]
  └── links to [[Weekly Workout Log]]
               [[Running Goals 2026]]
               [[Sleep Tracking Notes]]

[Projects/Running Goals 2026]
  └── links to [[Training Plan Template]]
               [[Race Schedule 2026]]
               [[VO2 Max Notes]]

[Resources/VO2 Max Notes]
  └── links to [[Running Economy]]
               [[Altitude Training]]
               [[Jack Daniels Running Formula Summary]]
```

Each note is small and focused. The links create the structure. The graph view shows Health → Running Goals 2026 → VO2 Max Notes as a chain with branches.

---

## Common Mistakes

**Collecting without connecting.** Saving notes is easy. Linking them is where the value comes from. After saving any note, ask: what existing note should link to this?

**Too many folders inside PARA.** Kosha uses the four PARA folders. Don't create subfolders — use descriptive note titles and wikilinks instead. Search and the graph replace folders.

**Treating Archive as deletion.** Notes in Archive are still searchable. When a project ends, Archive it — don't delete it. You'll be surprised how often old project notes are useful a year later.

**Waiting to process.** If you capture but never process, your notes pile up as unconnected stubs. Even five minutes of evening processing keeps the system alive.

**Perfectionism.** A note that's 60% complete and linked is worth ten times a perfect note that doesn't exist yet. Write fast, link early, refine later.

---

## Keyboard Reference

| Key | Action |
|-----|--------|
| `⌘ N` | New note |
| `⌘ K` | Focus search |
| `⌘ S` | Save now |
| `⌘ ⇧ P` | Toggle split preview |
| `Escape` | Close modal / clear search |

---

*Notes live as plain `.md` files in the `notes/` folder. You can edit them in any text editor, sync them with any tool, and back them up with git. Kosha is a UI — your notes are yours.*
