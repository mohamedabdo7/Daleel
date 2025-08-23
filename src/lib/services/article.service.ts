// lib/services/articles.service.ts
import { ApiService } from "./api.service";

// TypeScript Interfaces based on API responses

export interface Category {
  id: number;
  uuid: string;
  slug: string;
  title: string;
  desc: string;
  file: string;
  articles_count: number;
  created_at: string;
}

export interface CategoryResponse {
  data: Category[];
}

export interface Article {
  id: number;
  slug: string;
  title: string;
}

export interface ArticlesByCategoryResponse {
  status: number;
  data: Article[];
}

export interface ArticleContent {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  category: string;
  body: string;
  file: string;
  link: string;
  views_count: number;
  likes_count: number;
  dislikes_count: number;
  user_liked: boolean;
  user_disliked: boolean;
  active: boolean;
  created_at: string;
}

export interface ArticleContentResponse {
  data: ArticleContent;
  status: number;
  message: string;
}

// Articles API Service Class
export class ArticlesService {
  /**
   * Fetch all article categories
   */
  static async getCategories(): Promise<CategoryResponse> {
    try {
      const response = await ApiService.get<CategoryResponse>(
        "/article_categories"
      );
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch article categories");
    }
  }

  /**
   * Fetch articles by category slug
   */
  static async getArticlesByCategory(
    categorySlug: string
  ): Promise<ArticlesByCategoryResponse> {
    try {
      const response = await ApiService.get<ArticlesByCategoryResponse>(
        `/articles_by_category_slug/${categorySlug}`
      );
      return response;
    } catch (error) {
      console.error(
        `Error fetching articles for category ${categorySlug}:`,
        error
      );
      throw new Error(`Failed to fetch articles for category: ${categorySlug}`);
    }
  }

  /**
   * Fetch article content by slug
   */
  static async getArticleBySlug(
    articleSlug: string
  ): Promise<ArticleContentResponse> {
    try {
      const response = await ApiService.get<ArticleContentResponse>(
        `/article_by_slug/${articleSlug}`
      );
      return response;
    } catch (error) {
      console.error(`Error fetching article ${articleSlug}:`, error);
      throw new Error(`Failed to fetch article: ${articleSlug}`);
    }
  }

  /**
   * Get estimated read time from article content
   */
  static calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    const wordCount = textContent.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  }

  /**
   * Extract key points from HTML content (basic implementation)
   */
  static extractKeyPoints(htmlContent: string): string[] {
    // This is a basic implementation - you might want to enhance based on your content structure
    const textContent = htmlContent.replace(/<[^>]*>/g, "");
    const sentences = textContent
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);

    // Return first 4 meaningful sentences as key points
    return sentences
      .slice(0, 4)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 20); // Filter out very short sentences
  }

  /**
   * Clean HTML content for display
   */
  static cleanHtmlContent(htmlContent: string): string {
    // Remove HTML tags but preserve line breaks
    return htmlContent
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();
  }
}

// Helper type for transformed sidebar data
export interface TransformedSidebarItem {
  id: string;
  title: string;
  children?: TransformedSidebarItem[];
  isActive?: boolean;
  onClick?: () => void;
  slug?: string;
  articlesCount?: number;
  isLoading?: boolean;
}

// Utility functions for data transformation
export class ArticlesDataTransformer {
  /**
   * Transform categories to sidebar items
   */
  static categoriesToSidebarItems(
    categories: Category[]
  ): TransformedSidebarItem[] {
    return categories.map((category) => ({
      id: category.slug,
      title: category.title.replace("_", " "), // Clean up title formatting
      slug: category.slug,
      articlesCount: category.articles_count,
      children: [], // Will be populated when expanded
    }));
  }

  /**
   * Transform articles to sidebar items
   */
  static articlesToSidebarItems(articles: Article[]): TransformedSidebarItem[] {
    return articles.map((article) => ({
      id: article.slug,
      title: article.title,
      slug: article.slug,
    }));
  }

  /**
   * Transform article content for display
   */
  static transformArticleContent(articleData: ArticleContent) {
    const cleanContent = ArticlesService.cleanHtmlContent(articleData.body);
    const readTime = ArticlesService.calculateReadTime(cleanContent);
    const keyPoints = ArticlesService.extractKeyPoints(articleData.body);

    return {
      title: articleData.title,
      content: cleanContent,
      keyPoints,
      category: articleData.category,
      readTime,
      viewsCount: articleData.views_count,
      likesCount: articleData.likes_count,
      dislikesCount: articleData.dislikes_count,
      userLiked: articleData.user_liked,
      userDisliked: articleData.user_disliked,
      createdAt: articleData.created_at,
      slug: articleData.slug,
      imageUrl: articleData.file,
    };
  }
}
