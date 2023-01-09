import { uploadFile, findFile, upload } from "./excel.mjs";
const authRoutes = (router) => {
  router.post("/upload-file", upload.single("excel"), (req, res) =>
    uploadFile(req, res)
  );
  router.post("/find-file", (f, req, res) => findFile(f, req, res));
  router.post("/update-field", (req, res) => updateField(req, res));
  // router.post("/");
};

export default authRoutes;
