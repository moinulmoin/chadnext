import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Change = defineDocumentType(() => ({
  name: "Change",
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    version: { type: "string", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (change) => `/change/${change._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "src/app/changelog/content",
  documentTypes: [Change],
});
