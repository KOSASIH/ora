import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import ImageTool from '@editorjs/image';
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import axios from 'axios';
const Config = () => {
  return ({
    holder: "editorjs",
    placeholder:"_Your content here_",
    tools: {
      embed: Embed,
      table: Table,
      marker: Marker,
      list: List,
      warning: Warning,
      code: Code,
      linkTool: LinkTool,
      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: "https://piora.space/api/v1/posts/upload",
          },
          uploader: {
            async uploadByFile(file) {
              const data = new FormData();
              data.append("file", file);
              data.append("name", "file");
              const uploadResponse = await axios.post(
                "https://piora.space/api/v1/posts/upload",
                data, {
                  headers: {
                    "Content-Type": "multipart/form-data"
                  },
                }
              );
              return uploadResponse.data;
            },
          },
        },
        initData: null,
        data: {
          "withBorder" : false,
          "withBackground" : false,
          "stretched" : true
        },
      },
      raw: Raw,
      header: Header,
      quote: Quote,
      checklist: CheckList,
      delimiter: Delimiter,
      inlineCode: InlineCode,
      simpleImage: SimpleImage
    }
  })
}
export default Config