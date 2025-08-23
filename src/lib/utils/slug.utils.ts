// lib/utils/slug.utils.ts

/**
 * Utility functions for handling slugs and URLs
 */

export class SlugUtils {
  /**
   * Determine if a slug is a category or an article
   * Categories usually start with "section-" but we can also check against known categories
   */
  static isCategorySlug(slug: string): boolean {
    return (
      slug.startsWith("section-") ||
      slug.includes("medicine") ||
      slug.includes("pediatrics")
    );
  }

  /**
   * Convert title to slug format
   */
  static titleToSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim()
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }

  /**
   * Convert slug back to readable title
   */
  static slugToTitle(slug: string): string {
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /**
   * Extract section number from category slug
   */
  static extractSectionNumber(categorySlug: string): number | null {
    const match = categorySlug.match(/section-(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Generate breadcrumb items from slug
   */
  static generateBreadcrumbs(
    slug: string,
    categoryTitle?: string
  ): Array<{ label: string; href: string }> {
    const breadcrumbs = [{ label: "Articles", href: "/articles" }];

    if (this.isCategorySlug(slug)) {
      breadcrumbs.push({
        label: categoryTitle || this.slugToTitle(slug),
        href: `/articles/${slug}`,
      });
    } else if (categoryTitle) {
      // This is an article page, add category first
      breadcrumbs.push({
        label: categoryTitle,
        href: `/articles/${slug}`, // We'd need the category slug here
      });
      breadcrumbs.push({
        label: this.slugToTitle(slug),
        href: `/articles/${slug}`,
      });
    }

    return breadcrumbs;
  }

  /**
   * Validate slug format
   */
  static isValidSlug(slug: string): boolean {
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugPattern.test(slug) && slug.length > 0;
  }

  /**
   * Generate article URL
   */
  static generateArticleUrl(slug: string): string {
    return `/articles/${slug}`;
  }

  /**
   * Generate category URL
   */
  static generateCategoryUrl(slug: string): string {
    return `/articles/${slug}`;
  }

  /**
   * Parse dynamic route segments
   */
  static parseRouteSegments(segments: string[]): {
    type: "category" | "article";
    slug: string;
  } {
    const slug = segments.join("/");

    return {
      type: this.isCategorySlug(slug) ? "category" : "article",
      slug,
    };
  }

  /**
   * Get SEO-friendly meta title
   */
  static generateMetaTitle(
    title: string,
    type: "category" | "article"
  ): string {
    const suffix =
      type === "category" ? "Articles | DaleelFM" : "Article | DaleelFM";
    return `${title} - ${suffix}`;
  }

  /**
   * Get SEO-friendly meta description
   */
  static generateMetaDescription(
    title: string,
    description?: string,
    type: "category" | "article" = "article"
  ): string {
    if (description) {
      return description.length > 160
        ? `${description.substring(0, 157)}...`
        : description;
    }

    const typeText = type === "category" ? "Browse articles in" : "Read about";
    return `${typeText} ${title} on DaleelFM - Your comprehensive medical knowledge resource.`;
  }
}
