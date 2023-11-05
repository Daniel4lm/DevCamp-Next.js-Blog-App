import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";

interface EditorProps {
  value?: string;
  placeholder?: string;
  name: string;
  onValueChange: (val: string) => void;
  handleFieldValidation?: () => void;
}

const TinyMceEditor = (props: EditorProps) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  // const log = () => {
  //     if (editorRef.current) {
  //         console.log(editorRef.current.getContent());
  //     }
  // };

  return (
    <section className="flex flex-col w-full mt-5" id="editor-container">
      <Editor
        id="body"
        onInit={(evt, editor) => (editorRef.current = editor)}
        apiKey="oz2rwlm6sk9eisxmo7br2nfr2gsn7ryw2cl0iq86up8215z3"
        init={setupInitProps({
          placeholder: props.placeholder,
          toolbarMode: "sliding",
        })}
        value={props.value}
        data-testid="tinymce-editor"
        //tagName={props.name}
        onEditorChange={props.onValueChange}
        onBlur={props.handleFieldValidation}
      />
      <div className="invisible flex flex-row items-center justify-end rounded-b-lg px-5 py-2 z-100 editor-footer">
        <a
          className="flex m-auto text-sm text-indigo-400 dark:!text-slate-300"
          href="#"
          id="show-more"
        ></a>
        <div
          className="flex justify-self-end text-slate-500 dark:!text-slate-400 text-xs"
          id="word-count"
        ></div>
      </div>
    </section>
  );
};

let setupMceEditor = (
  editor: HTMLDivElement | null,
  toolbar: HTMLDivElement | null,
  content: HTMLDivElement | null
) => {
  // Avoid error when navigating away from the page while loading editor
  if (!editor) return;

  let footer = document.querySelector(
    ".editor-footer"
  ) as HTMLDivElement | null;

  let focusEditor = () => {
    //editor.style.setProperty('--tw-border-opacity', "1")
    footer!.classList.add("border-opacity-100");
    footer!.classList.remove("border-opacity-0");
    toolbar!.style.visibility = "visible";
  };

  let blurEditor = () => {
    //editor.style.setProperty('--tw-border-opacity', "0")
    footer!.classList.add("border-opacity-0");
    footer!.classList.remove("border-opacity-100");
    toolbar!.style.visibility = "hidden";
  };

  // editor.addEventListener('mouseenter', focusEditor)
  // editor.addEventListener('mouseleave', () => {
  //     if (document.activeElement != content) {
  //         blurEditor()
  //     }
  // })

  // footer!.addEventListener('mouseenter', focusEditor)
  // footer!.addEventListener('mouseleave', () => {
  //     if (document.activeElement != content) {
  //         blurEditor()
  //     }
  // })

  content!.addEventListener("focus", focusEditor);
  content!.addEventListener("blur", blurEditor);

  let showMore = document.getElementById("show-more");
  let editorHeight = editor?.offsetHeight || 0;
  showMore!.textContent = editorHeight > 500 ? "Show less" : "Show more";

  showMore!.addEventListener("click", (e) => {
    if (showMore!.textContent == "Show more") {
      content!.style.height = "500px";
      showMore!.textContent = "Show less";
    } else {
      content!.style.height = "250px";
      showMore!.textContent = "Show more";
    }
    e.preventDefault();
  });
};

interface SetupInitPropsProps {
  placeholder: string | undefined;
  toolbarMode: "floating" | "sliding" | "scrolling" | "wrap";
}

function setupInitProps({ placeholder, toolbarMode }: SetupInitPropsProps) {
  return {
    //auto_focus: "body-content",
    //target: document.querySelector('#editor') as HTMLElement,
    menubar: "file edit insert view format table tools help",
    formats: {
      tindent_format: { selector: "p", styles: { "text-indent": "40mm" } },
    },
    toolbar:
      "fullscreen preview print | undo redo | formatselect | bold italic underline strikethrough | superscript subscript codesample code | link image media | forecolor backcolor blockquote | alignleft aligncenter alignright alignjustify tindent_bttn | curDateBtn anchorTagBtn | numlist bullist outdent indent | removeformat",
    plugins: [
      "wordcount",
      "link",
      "preview",
      "fullscreen",
      "insertdatetime",
      "wordcount",
      "insertdatetime",
      "pagebreak",
      "preview",
      "searchreplace",
      "autolink",
      "directionality",
      "visualblocks",
      "visualchars",
      "fullscreen",
      "image",
      "media",
      "template", // <- depricate soon
      "codesample",
      "code",
      "table",
      "charmap",
      "nonbreaking",
      "advlist",
      "lists",
      "anchor",
    ],
    //plugins: "print preview paste searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern",
    mobile: {
      theme: "mobile",
      toolbar: ["undo", "bold", "italic", "styleselect, restoredraft"],
    },
    fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt",
    contextmenu: "copy  wordcount",
    toolbar_mode: toolbarMode || "floating",
    browser_spellcheck: true,
    language: "en",
    //language_url: "/tinymce/langs/en.js",
    placeholder: placeholder,
    branding: false,
    //min_height: 400,
    //height: "800px",
    //codesample_global_prismjs: true,
    codesample_languages: [
      { text: "HTML/XML", value: "markup" },
      { text: "JavaScript", value: "javascript" },
      { text: "CSS", value: "css" },
      { text: "PHP", value: "php" },
      { text: "Ruby", value: "ruby" },
      { text: "Elixir", value: "elixir" },
      { text: "Python", value: "python" },
      { text: "Java", value: "java" },
      { text: "C", value: "c" },
      { text: "C#", value: "csharp" },
      { text: "C++", value: "cpp" },
    ],
    setup: (editor: TinyMCEEditor) => {
      editor.on("init", () => {
        let editorEl = document.querySelector(
          ".tox-tinymce"
        ) as HTMLDivElement | null;
        let editorContentEl = document.querySelector(
          ".tox-tinymce"
        ) as HTMLDivElement | null;
        let toolbar = document.querySelector(
          ".tox-editor-header"
        ) as HTMLDivElement | null;
        editor.dom.setAttrib(
          editor.dom.select("main"),
          "data-testid",
          "tinymce-editor"
        );

        setupMceEditor(editorEl, toolbar, editorContentEl);
      });

      // editor.on('Change', () => {
      //     let editorContentEl = document.querySelector('.mce-content-body')
      //     console.log("The HTML is now:" + editor.getBody().innerHTML);
      // });

      editor.on("ResizeEditor", () => {
        let editor = document.querySelector(
          ".tox-tinymce"
        ) as HTMLDivElement | null;

        let showMore = document.getElementById("show-more");
        let editorHeight = editor?.offsetHeight || 0;
        showMore!.textContent = editorHeight > 500 ? "Show less" : "Show more";
      });

      editor.on("focus", function (e) {
        let editorEl = document.querySelector(
          ".tox-tinymce"
        ) as HTMLDivElement | null;
        editorEl?.classList.add(
          "!ring-2",
          "ring-indigo-400",
          "ring-opacity-90",
          "!border-transparent",
          "dark:border-transparent",
          "dark:ring-blue-400"
        );
        editor.dom.removeClass(editor.dom.select("body"), "offline");
        editor.dom.addClass(editor.dom.select("body"), "online");
      });

      editor.on("blur", function () {
        let editorEl = document.querySelector(
          ".tox-tinymce"
        ) as HTMLDivElement | null;
        editorEl?.classList.remove(
          "!ring-2",
          "ring-indigo-400",
          "ring-opacity-90",
          "!border-transparent",
          "dark:border-transparent",
          "dark:ring-blue-400"
        );
        editor.dom.removeClass(editor.dom.select("body"), "online");
        editor.dom.addClass(editor.dom.select("body"), "offline");
      });

      // editor.on("mouseenter", function () {
      //     let editorFooter = document.querySelector('.editor-footer') as HTMLDivElement | null
      //     editorFooter?.classList.remove('invisible')
      // });
      // editor.on("mouseleave", function () {
      //     let editorFooter = document.querySelector('.editor-footer') as HTMLDivElement | null
      //     editorFooter?.classList.add('invisible')
      // });

      editor.on("WordCountUpdate", ({ wordCount: { words } }) => {
        let wordCount = document.getElementById("word-count");
        if (wordCount) wordCount.textContent = `${words} words`;
      });
      editor.ui.registry.addIcon(
        "curDate",
        '<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="21px" height="21px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><rect x="23.333" y="50" width="12" height="8" style="stroke:#ff0000;stroke-width:2;fill:#ffffff"/><rect x="43.333" y="50" width="12" height="8" style="stroke:#000000;stroke-width:2;fill:#ffffff"/><rect x="63.333" y="50" width="12" height="8" style="stroke:#000000;stroke-width:2;fill:#ffffff"/><rect x="23.333" y="66.666" 0width="12" height="8" style="stroke:#000000;stroke-width:2;fill:#ffffff"/><rect x="43.333" y="66.666" width="12" height="8" style="stroke:#000000;stroke-width:2;fill:#ffffff"/><rect x="63.333" y="66.666" width="12" height="8" style="stroke:#000000;stroke-width:2;fill:#ffffff"/><path d="M83.333,16.666h-10V10h-6.666v6.667H33.333V10h-6.666v6.667h-10c-3.666,0-6.667,3.001-6.667,6.667v66.666h80V23.333 C90,19.667,86.999,16.666,83.333,16.666z M83.333,83.333H16.667v-40h66.666V83.333z M16.667,36.666V23.333h10V30h6.666v-6.667 h33.334V30h6.666v-6.667h10v13.333H16.667z"/></svg>'
      );
      editor.ui.registry.addButton("curDateBtn", {
        icon: "curDate",
        tooltip: "Insert current date",
        onAction: function () {
          var d = new Date();
          var n = d.getDay();
          var fecha: string = d.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          editor.execCommand("mceInsertContent", false, fecha);
        },
      });
      editor.ui.registry.addIcon(
        "anchorTag",
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.784 14L8.204 10H4V8H8.415L8.94 3H10.951L10.426 8H14.415L14.94 3H16.951L16.426 8H20V10H16.216L15.796 14H20V16H15.585L15.06 21H13.049L13.574 16H9.585L9.06 21H7.049L7.574 16H4V14H7.784ZM9.795 14H13.785L14.205 10H10.215L9.795 14Z"/></svg>'
      );
      editor.ui.registry.addButton("anchorTagBtn", {
        icon: "anchorTag",
        tooltip: "Insert section anchor tag",
        onAction: function () {
          var href = prompt("Enter the anchor tag title:");
          if (href) {
            let content = href.toLowerCase().replaceAll(/[,\s'\/]/g, "-");
            editor.execCommand(
              "mceInsertContent",
              false,
              `<a id=${content} href=#${content} rel="noopener noreferrer" class="text-link">${href}</a>`
            );
          }
        },
      });
    },
    //content_css: "src/app/posts/editor.css",
    content_style: `
        html{
            display: flex;
            flex-flow: row nowrap; 
            margin: 0; 
            padding: 0; 
            /*background: rgb(248 249 250);*/
        }

        body {
            /*zoom: 1.5;*/
            width: 100%;
            padding: 5px;
            text-align: justify;
            line-height: 1.5;
            /*font-family: Arial;*/
            font-size: 12pt;
            /*overflow-x: auto;*/
        }

        .mce-content-body:not([dir="rtl"])[data-mce-placeholder]:not(.mce-visualblocks)::before {
            left: 5px;
        }

        .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
            color: rgba(34,47,62,.7);
        }

        body blockquote {
        @apply border-l-[0.3rem] border-l-slate-300 bg-slate-100 dark:bg-slate-500 ml-0 mr-0 px-[1.5rem] py-[1rem];
        }

        body pre {
        @apply block relative text-[0.8em] md:text-[0.95em] text-[#ccc] rounded-lg bg-[#2d2d2d] my-2 whitespace-pre-wrap break-words leading-5 p-3;
        }

        body img {
        @apply w-auto mx-auto rounded-lg p-1;
        }

        .mce-content-body p {
            margin: 0
        }

        figure {
            outline: 3px solid #dedede;
            position: relative;
            display: inline-block
        }

        figure:hover {
            outline-color: #ffc83d
        }

        figure > figcaption {
            color: #333;
            background-color: #f7f7f7;
            text-align: center
        }
        `,
  };
}

export default TinyMceEditor;
