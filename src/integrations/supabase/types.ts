export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          category: string
          excerpt: string
          id: string
          image_url: string | null
          published_at: string
          read_minutes: number
          title: string
          url: string | null
        }
        Insert: {
          category?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          published_at?: string
          read_minutes?: number
          title: string
          url?: string | null
        }
        Update: {
          category?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          published_at?: string
          read_minutes?: number
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          accent: string
          created_at: string
          description: string
          id: string
          logo_url: string | null
          name: string
          tags: string[]
        }
        Insert: {
          accent?: string
          created_at?: string
          description?: string
          id?: string
          logo_url?: string | null
          name: string
          tags?: string[]
        }
        Update: {
          accent?: string
          created_at?: string
          description?: string
          id?: string
          logo_url?: string | null
          name?: string
          tags?: string[]
        }
        Relationships: []
      }
      jobs: {
        Row: {
          apply_url: string | null
          benefits: string | null
          category: string
          company: string
          created_at: string
          description: string | null
          featured: boolean
          how_to_apply: string | null
          id: string
          industry: string | null
          job_type: string
          location: string
          logo_url: string | null
          requirements: string | null
          salary: string | null
          title: string
          who_can_apply: string | null
        }
        Insert: {
          apply_url?: string | null
          benefits?: string | null
          category?: string
          company: string
          created_at?: string
          description?: string | null
          featured?: boolean
          how_to_apply?: string | null
          id?: string
          industry?: string | null
          job_type?: string
          location?: string
          logo_url?: string | null
          requirements?: string | null
          salary?: string | null
          title: string
          who_can_apply?: string | null
        }
        Update: {
          apply_url?: string | null
          benefits?: string | null
          category?: string
          company?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          how_to_apply?: string | null
          id?: string
          industry?: string | null
          job_type?: string
          location?: string
          logo_url?: string | null
          requirements?: string | null
          salary?: string | null
          title?: string
          who_can_apply?: string | null
        }
        Relationships: []
      }
      scholarships: {
        Row: {
          amount: string | null
          apply_url: string | null
          benefits: string | null
          country: string
          created_at: string
          deadline: string | null
          description: string
          how_to_apply: string | null
          id: string
          level: string
          logo_url: string | null
          organization: string
          requirements: string | null
          tags: string[]
          title: string
          who_can_apply: string | null
        }
        Insert: {
          amount?: string | null
          apply_url?: string | null
          benefits?: string | null
          country?: string
          created_at?: string
          deadline?: string | null
          description?: string
          how_to_apply?: string | null
          id?: string
          level?: string
          logo_url?: string | null
          organization: string
          requirements?: string | null
          tags?: string[]
          title: string
          who_can_apply?: string | null
        }
        Update: {
          amount?: string | null
          apply_url?: string | null
          benefits?: string | null
          country?: string
          created_at?: string
          deadline?: string | null
          description?: string
          how_to_apply?: string | null
          id?: string
          level?: string
          logo_url?: string | null
          organization?: string
          requirements?: string | null
          tags?: string[]
          title?: string
          who_can_apply?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string
          created_at: string
          id: string
          name: string
          quote: string
          rating: number
          role: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string
          created_at?: string
          id?: string
          name: string
          quote: string
          rating?: number
          role?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string
          created_at?: string
          id?: string
          name?: string
          quote?: string
          rating?: number
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
