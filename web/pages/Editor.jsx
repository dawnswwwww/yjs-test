import React, { useState, useMemo, useCallback, useEffect } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import {
  withYHistory,
  withYjs,
  slateNodesToInsertDelta,
  YjsEditor,
} from "@slate-yjs/core";
import * as Y from "yjs";
const initialValue = [
  // {
  //   type: "paragraph",
  //   children: [{ text: "A line of text in a paragraph." }],
  // },
];

const Editor = () => {
  const [value, setValue] = useState(initialValue);

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: "ws://127.0.0.1:1234",
        name: "slate-yjs-demo",
      }),
    []
  );

  const sharedType = useMemo(() => {
    const yDoc = new Y.Doc();
    const shared = provider.document.get('content', Y.XmlText);
    shared.applyDelta(slateNodesToInsertDelta(initialValue));
    return shared;
  }, []);

  const editor = useMemo(
    () => withReact(withYHistory(withYjs(createEditor(), sharedType))),
    [provider.document]
  );

  useEffect(() => () => YjsEditor.disconnect(editor), [editor]);
  useEffect(() => () => provider.disconnect(), [provider]);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) =>setValue(value)}
    >
      <Editable />
    </Slate>
  );
};

export default Editor;
