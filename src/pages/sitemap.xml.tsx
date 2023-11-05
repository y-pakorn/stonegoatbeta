import { GRADES_LABEL } from "@/constants/grades";
import { MENU } from "@/constants/menu";
import { ZONES } from "@/constants/zones";

const SiteMap = () => {};

const generateSiteMap = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${MENU.map(
       (menu) => `
       <url>
          <loc>${process.env.NEXT_PUBLIC_APP_URL}${menu.href}</loc>
       </url>
     `
     ).join("")}
     ${ZONES.map(
       (zone) => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_APP_URL}/zones/${zone.label}</loc>
        </url>
     `
     ).join("")}
     ${GRADES_LABEL.map(
       (grade) => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_APP_URL}/grades/${grade}</loc>
        </url>
     `
     ).join("")}
   </urlset>
 `;
};

export async function getServerSideProps(context: any) {
  context.res.setHeader("Content-Type", "text/xml");

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
    context.res.write(generateSiteMap());
  }

  context.res.end();

  return {
    props: {},
  };
}

export default SiteMap;
