"use client";

import type { Block } from "@/lib/lessons";
import { BulletList, Callout, Compare, Paragraph, SectionHeading, WorkedExample } from "./blocks";
import { Myths, SortExercise, Timeline } from "./interactive-blocks";
import { InlineCheck } from "./quiz-launcher";
import { widgets } from "./widgets";

function renderBlock(block: Block, key: number, lesson: string) {
  switch (block.type) {
    case "p":
      return <Paragraph key={key} text={block.text} />;
    case "list":
      return <BulletList key={key} items={block.items} ordered={block.ordered} />;
    case "callout":
      return <Callout key={key} tone={block.tone} title={block.title} text={block.text} />;
    case "example":
      return <WorkedExample key={key} {...block} />;
    case "compare":
      return <Compare key={key} columns={block.columns} />;
    case "widget": {
      const Widget = widgets[block.widget];
      return <Widget key={key} />;
    }
    case "timeline":
      return <Timeline key={key} items={block.items} />;
    case "myths":
      return <Myths key={key} items={block.items} />;
    case "sort":
      return <SortExercise key={key} prompt={block.prompt} bins={block.bins} items={block.items} />;
    case "check":
      return <InlineCheck key={key} lesson={lesson} id={block.id} />;
    case "h2":
      return null;
  }
}

export type Section = { id: string; title: string };

/** Splits blocks at each h2 so every section is an observable, linkable unit. */
export function sectionsOf(blocks: Block[]): Section[] {
  return blocks.flatMap((b) => (b.type === "h2" ? [{ id: b.id, title: b.text }] : []));
}

export function BlockRenderer({ blocks, lesson }: { blocks: Block[]; lesson: string }) {
  const groups: { heading?: Extract<Block, { type: "h2" }>; body: Block[] }[] = [{ body: [] }];
  for (const b of blocks) {
    if (b.type === "h2") groups.push({ heading: b, body: [] });
    else groups[groups.length - 1].body.push(b);
  }

  return (
    <>
      {groups.map((g, gi) =>
        g.heading ? (
          <section key={g.heading.id} data-section={g.heading.id}>
            <SectionHeading id={g.heading.id} text={g.heading.text} />
            {g.body.map((b, i) => renderBlock(b, i, lesson))}
          </section>
        ) : (
          g.body.length > 0 && <div key={`intro-${gi}`}>{g.body.map((b, i) => renderBlock(b, i, lesson))}</div>
        ),
      )}
    </>
  );
}
