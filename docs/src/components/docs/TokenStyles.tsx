import { getDocsTokenCss } from "@/lib/token-css";

export default function TokenStyles() {
  return <style dangerouslySetInnerHTML={{ __html: getDocsTokenCss() }} />;
}
