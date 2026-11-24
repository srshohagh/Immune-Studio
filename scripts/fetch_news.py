"""Collects the latest gear, marketing and tech headlines into data/news.json.
Runs on a schedule from .github/workflows/update-news.yml (no API keys needed)."""
import datetime, html, json, re, sys
import feedparser

# (source name, feed URL, default category, classify mode)  mode: "gear" | "tech" | None
FEEDS = [
    ("PetaPixel", "https://petapixel.com/feed/", "Cameras", "gear"),
    ("DPReview", "https://www.dpreview.com/feeds/news.xml", "Cameras", "gear"),
    ("CineD", "https://www.cined.com/feed/", "Cameras", "gear"),
    ("No Film School", "https://nofilmschool.com/rss.xml", "Cameras", "gear"),
    ("DroneDJ", "https://dronedj.com/feed/", "Drones", "gear"),
    ("DroneLife", "https://dronelife.com/feed/", "Drones", "gear"),
    ("Social Media Examiner", "https://www.socialmediaexaminer.com/feed/", "Marketing", None),
    ("Search Engine Journal", "https://www.searchenginejournal.com/feed/", "Marketing", None),
    ("Content Marketing Institute", "https://contentmarketinginstitute.com/feed/", "Marketing", None),
    ("The Verge", "https://www.theverge.com/rss/index.xml", "Tech and AI", "tech"),
    ("TechCrunch", "https://techcrunch.com/feed/", "Tech and AI", "tech"),
]
DRONE = re.compile(r"\b(drone|drones|dji|fpv|uav|quadcopter)\b", re.I)
AUDIO = re.compile(r"\b(mic|mics|microphone|microphones|lavalier|audio recorder|wireless audio|podcast mic)\b", re.I)
LIGHT = re.compile(r"\b(led light|led panel|lighting|softbox|strobe|aputure|godox|nanlite|light panel)\b", re.I)
CAM = re.compile(r"\b(camera|cameras|lens|lenses|mirrorless|gimbal|cinema|sony|canon|nikon|fujifilm|panasonic|blackmagic|arri|red komodo)\b", re.I)
MAX_PER_FEED, MAX_PER_CAT, MAX_AGE_DAYS = 10, 14, 60
UA = "ImmuneStudioNewsBot/1.0 (+https://github.com/srshohagh/Immune-Studio)"

def clean(text, limit=170):
    t = re.sub(r"<[^>]+>", " ", html.unescape(text or ""))
    t = re.sub(r"\s+", " ", t).strip()
    if len(t) <= limit:
        return t
    return t[:limit].rsplit(" ", 1)[0].rstrip(".,;:") + "…"

def image_of(e):
    for key in ("media_thumbnail", "media_content"):
        for m in e.get(key, []) or []:
            if m.get("url"):
                return m["url"]
    for l in e.get("links", []) or []:
        if l.get("rel") == "enclosure" and str(l.get("type", "")).startswith("image"):
            return l.get("href")
    blob = (e.get("summary") or "") + " ".join(c.get("value", "") for c in e.get("content", []) or [])
    m = re.search(r'<img[^>]+src=["\']([^"\']+)', blob)
    return m.group(1) if m else ""

def categorize(text, default, mode):
    if mode in ("gear", "tech"):
        if DRONE.search(text): return "Drones"
        if AUDIO.search(text): return "Audio and Light"
        if LIGHT.search(text): return "Audio and Light"
    if mode == "gear" and CAM.search(text):
        return "Cameras"
    return default

def main():
    now = datetime.datetime.now(datetime.timezone.utc)
    seen, items = set(), []
    for name, url, default, mode in FEEDS:
        try:
            feed = feedparser.parse(url, agent=UA)
        except Exception as ex:
            print("skip", name, ex); continue
        count = 0
        for e in feed.entries:
            link, title = e.get("link"), clean(e.get("title"), 140)
            if not link or not title or link in seen:
                continue
            t = e.get("published_parsed") or e.get("updated_parsed")
            when = datetime.datetime(*t[:6], tzinfo=datetime.timezone.utc) if t else now
            if (now - when).days > MAX_AGE_DAYS:
                continue
            summary = clean(e.get("summary") or (e.get("content") or [{}])[0].get("value", ""))
            seen.add(link); count += 1
            items.append({"title": title, "link": link, "source": name, "date": when.isoformat(),
                          "summary": summary, "img": image_of(e),
                          "cat": categorize(title + " " + summary, default, mode)})
            if count >= MAX_PER_FEED:
                break
        print(name, count)
    if not items:
        print("No items fetched, keeping the existing file."); sys.exit(0)
    items.sort(key=lambda i: i["date"], reverse=True)
    per, final = {}, []
    for i in items:
        if per.get(i["cat"], 0) < MAX_PER_CAT:
            per[i["cat"]] = per.get(i["cat"], 0) + 1; final.append(i)
    with open("data/news.json", "w", encoding="utf-8") as f:
        json.dump({"updated": now.isoformat(), "items": final}, f, ensure_ascii=False, indent=1)
    print("Wrote", len(final), "items")

if __name__ == "__main__":
    main()
