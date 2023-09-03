import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Change = defineDocumentType(() => ({
  name: "Change",
  filePathPattern: `changelog/**/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    version: { type: "string", required: true },
  },
}));

export const About = defineDocumentType(() => ({
  name: "About",
  filePathPattern: `about/**/*.md`,
  fields: {
    title: { type: "string", required: true },
  },
}));

export default makeSource({
  contentDirPath: "./src/content",
  documentTypes: [Change, About],
});
