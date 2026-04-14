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
      audit_log: {
        Row: {
          action: string
          created_at: string
          dealer_id: string | null
          details: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          dealer_id?: string | null
          details?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          dealer_id?: string | null
          details?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      claims: {
        Row: {
          assigned_to: string | null
          at_garage: boolean | null
          checklist: Json | null
          created_at: string
          current_mileage: number | null
          customer_email: string
          customer_id: string
          customer_name: string
          dealer_id: string
          dealer_name: string
          decision_amount: number | null
          decision_by: string | null
          decision_date: string | null
          decision_reason: string | null
          decision_type: string | null
          description: string | null
          files: Json | null
          garage_contact: string | null
          garage_name: string | null
          id: string
          issue_start_date: string | null
          issue_title: string
          messages: Json | null
          priority: string
          reference: string
          repairs_authorised: boolean | null
          status: string
          timeline: Json | null
          triage_outcome: string | null
          updated_at: string
          vehicle_drivable: string | null
          vehicle_make: string
          vehicle_model: string
          vehicle_reg: string
          warranty_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          at_garage?: boolean | null
          checklist?: Json | null
          created_at?: string
          current_mileage?: number | null
          customer_email: string
          customer_id: string
          customer_name: string
          dealer_id: string
          dealer_name: string
          decision_amount?: number | null
          decision_by?: string | null
          decision_date?: string | null
          decision_reason?: string | null
          decision_type?: string | null
          description?: string | null
          files?: Json | null
          garage_contact?: string | null
          garage_name?: string | null
          id?: string
          issue_start_date?: string | null
          issue_title: string
          messages?: Json | null
          priority?: string
          reference: string
          repairs_authorised?: boolean | null
          status?: string
          timeline?: Json | null
          triage_outcome?: string | null
          updated_at?: string
          vehicle_drivable?: string | null
          vehicle_make: string
          vehicle_model: string
          vehicle_reg: string
          warranty_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          at_garage?: boolean | null
          checklist?: Json | null
          created_at?: string
          current_mileage?: number | null
          customer_email?: string
          customer_id?: string
          customer_name?: string
          dealer_id?: string
          dealer_name?: string
          decision_amount?: number | null
          decision_by?: string | null
          decision_date?: string | null
          decision_reason?: string | null
          decision_type?: string | null
          description?: string | null
          files?: Json | null
          garage_contact?: string | null
          garage_name?: string | null
          id?: string
          issue_start_date?: string | null
          issue_title?: string
          messages?: Json | null
          priority?: string
          reference?: string
          repairs_authorised?: boolean | null
          status?: string
          timeline?: Json | null
          triage_outcome?: string | null
          updated_at?: string
          vehicle_drivable?: string | null
          vehicle_make?: string
          vehicle_model?: string
          vehicle_reg?: string
          warranty_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_warranty_id_fkey"
            columns: ["warranty_id"]
            isOneToOne: false
            referencedRelation: "warranties"
            referencedColumns: ["id"]
          },
        ]
      }
      cover_templates: {
        Row: {
          conditional_items: Json
          covered_items: Json
          created_at: string
          dealer_id: string
          excluded_items: Json
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          conditional_items?: Json
          covered_items?: Json
          created_at?: string
          dealer_id: string
          excluded_items?: Json
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          conditional_items?: Json
          covered_items?: Json
          created_at?: string
          dealer_id?: string
          excluded_items?: Json
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_requests: {
        Row: {
          created_at: string
          customer_email: string
          customer_id: string
          customer_name: string
          dealer_id: string
          description: string
          id: string
          status: string
          type: string
          updated_at: string
          warranty_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_id: string
          customer_name: string
          dealer_id: string
          description: string
          id?: string
          status?: string
          type: string
          updated_at?: string
          warranty_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_id?: string
          customer_name?: string
          dealer_id?: string
          description?: string
          id?: string
          status?: string
          type?: string
          updated_at?: string
          warranty_id?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          dealer_id: string
          email: string
          full_name: string
          id: string
          phone: string | null
          postcode: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          dealer_id: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          postcode?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          dealer_id?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          postcode?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      dealer_settings: {
        Row: {
          created_at: string
          dealer_id: string
          dismissed_recommendation_until: string | null
          free_warranties_total: number
          free_warranties_used: number
          id: string
          last_recommendation_date: string | null
          max_labour_rate: number
          max_per_claim_limit: number
          monthly_sales_target: number
          smart_contribution_mode: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dealer_id: string
          dismissed_recommendation_until?: string | null
          free_warranties_total?: number
          free_warranties_used?: number
          id?: string
          last_recommendation_date?: string | null
          max_labour_rate?: number
          max_per_claim_limit?: number
          monthly_sales_target?: number
          smart_contribution_mode?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dealer_id?: string
          dismissed_recommendation_until?: string | null
          free_warranties_total?: number
          free_warranties_used?: number
          id?: string
          last_recommendation_date?: string | null
          max_labour_rate?: number
          max_per_claim_limit?: number
          monthly_sales_target?: number
          smart_contribution_mode?: string
          updated_at?: string
        }
        Relationships: []
      }
      dealers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          dealer_code: string
          email: string
          fca_number: string | null
          free_warranties_used: number
          free_warranty_limit: number
          id: string
          joined_at: string
          name: string
          phone: string | null
          postcode: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          dealer_code: string
          email: string
          fca_number?: string | null
          free_warranties_used?: number
          free_warranty_limit?: number
          id?: string
          joined_at?: string
          name: string
          phone?: string | null
          postcode?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          dealer_code?: string
          email?: string
          fca_number?: string | null
          free_warranties_used?: number
          free_warranty_limit?: number
          id?: string
          joined_at?: string
          name?: string
          phone?: string | null
          postcode?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      dispute_cases: {
        Row: {
          ai_approach: string | null
          ai_position: string | null
          ai_risk_level: string | null
          ai_summary: string | null
          ai_tone_recommendation: string | null
          complaint_type: string
          cra_explanation: string | null
          cra_window: string | null
          created_at: string
          customer_name: string
          customer_summary: string
          dealer_id: string
          drivable: string
          edited_response: string | null
          escalation_flags: Json | null
          id: string
          issue_classification: string | null
          issue_date: string
          linked_claim_id: string | null
          mileage_at_sale: number
          mileage_now: number
          notes: string | null
          outcome: string | null
          repairs_authorised: string
          response_score: Json | null
          responses: Json | null
          risk_alerts: Json | null
          sale_date: string
          selected_response: string | null
          status: string
          strategy_do_nots: Json | null
          strategy_key_risks: Json | null
          strategy_suggested_stance: string | null
          updated_at: string
          vehicle_reg: string
          warranty_status: string
        }
        Insert: {
          ai_approach?: string | null
          ai_position?: string | null
          ai_risk_level?: string | null
          ai_summary?: string | null
          ai_tone_recommendation?: string | null
          complaint_type: string
          cra_explanation?: string | null
          cra_window?: string | null
          created_at?: string
          customer_name?: string
          customer_summary?: string
          dealer_id: string
          drivable?: string
          edited_response?: string | null
          escalation_flags?: Json | null
          id?: string
          issue_classification?: string | null
          issue_date: string
          linked_claim_id?: string | null
          mileage_at_sale?: number
          mileage_now?: number
          notes?: string | null
          outcome?: string | null
          repairs_authorised?: string
          response_score?: Json | null
          responses?: Json | null
          risk_alerts?: Json | null
          sale_date: string
          selected_response?: string | null
          status?: string
          strategy_do_nots?: Json | null
          strategy_key_risks?: Json | null
          strategy_suggested_stance?: string | null
          updated_at?: string
          vehicle_reg?: string
          warranty_status?: string
        }
        Update: {
          ai_approach?: string | null
          ai_position?: string | null
          ai_risk_level?: string | null
          ai_summary?: string | null
          ai_tone_recommendation?: string | null
          complaint_type?: string
          cra_explanation?: string | null
          cra_window?: string | null
          created_at?: string
          customer_name?: string
          customer_summary?: string
          dealer_id?: string
          drivable?: string
          edited_response?: string | null
          escalation_flags?: Json | null
          id?: string
          issue_classification?: string | null
          issue_date?: string
          linked_claim_id?: string | null
          mileage_at_sale?: number
          mileage_now?: number
          notes?: string | null
          outcome?: string | null
          repairs_authorised?: string
          response_score?: Json | null
          responses?: Json | null
          risk_alerts?: Json | null
          sale_date?: string
          selected_response?: string | null
          status?: string
          strategy_do_nots?: Json | null
          strategy_key_risks?: Json | null
          strategy_suggested_stance?: string | null
          updated_at?: string
          vehicle_reg?: string
          warranty_status?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          read: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          read?: boolean
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          read?: boolean
          subject?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          dealer_id: string | null
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dealer_id?: string | null
          email: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dealer_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      signup_requests: {
        Row: {
          address: string | null
          city: string | null
          contact_name: string
          created_at: string
          dealership_name: string
          email: string
          estimated_volume: string | null
          fca_number: string | null
          id: string
          message: string | null
          phone: string | null
          postcode: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          status: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_name: string
          created_at?: string
          dealership_name: string
          email: string
          estimated_volume?: string | null
          fca_number?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          postcode?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_name?: string
          created_at?: string
          dealership_name?: string
          email?: string
          estimated_volume?: string | null
          fca_number?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          postcode?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          dealer_id: string
          dealer_name: string
          id: string
          messages: Json
          priority: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dealer_id: string
          dealer_name: string
          id?: string
          messages?: Json
          priority?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dealer_id?: string
          dealer_name?: string
          id?: string
          messages?: Json
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      warranties: {
        Row: {
          cost: number
          cover_template_id: string | null
          cover_template_name: string | null
          created_at: string
          customer_email: string
          customer_id: string | null
          customer_name: string
          dealer_id: string
          dealer_name: string
          duration_months: number
          end_date: string
          id: string
          is_free: boolean
          notes: string | null
          reference: string
          start_date: string
          status: string
          updated_at: string
          vehicle_make: string
          vehicle_mileage: number | null
          vehicle_model: string
          vehicle_reg: string
          vehicle_year: string | null
        }
        Insert: {
          cost?: number
          cover_template_id?: string | null
          cover_template_name?: string | null
          created_at?: string
          customer_email: string
          customer_id?: string | null
          customer_name: string
          dealer_id: string
          dealer_name: string
          duration_months?: number
          end_date: string
          id?: string
          is_free?: boolean
          notes?: string | null
          reference: string
          start_date?: string
          status?: string
          updated_at?: string
          vehicle_make: string
          vehicle_mileage?: number | null
          vehicle_model: string
          vehicle_reg: string
          vehicle_year?: string | null
        }
        Update: {
          cost?: number
          cover_template_id?: string | null
          cover_template_name?: string | null
          created_at?: string
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          dealer_id?: string
          dealer_name?: string
          duration_months?: number
          end_date?: string
          id?: string
          is_free?: boolean
          notes?: string | null
          reference?: string
          start_date?: string
          status?: string
          updated_at?: string
          vehicle_make?: string
          vehicle_mileage?: number | null
          vehicle_model?: string
          vehicle_reg?: string
          vehicle_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warranties_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      warranty_lines: {
        Row: {
          business_name: string
          created_at: string
          dealer_id: string
          forwarding_number: string
          greeting_message: string
          hold_music_type: string
          id: string
          ivr_enabled: boolean
          option1_label: string
          option2_label: string
          option3_label: string
          phone_number: string | null
          status: string
          updated_at: string
          voicemail_email: string
          voicemail_enabled: boolean
        }
        Insert: {
          business_name?: string
          created_at?: string
          dealer_id: string
          forwarding_number?: string
          greeting_message?: string
          hold_music_type?: string
          id?: string
          ivr_enabled?: boolean
          option1_label?: string
          option2_label?: string
          option3_label?: string
          phone_number?: string | null
          status?: string
          updated_at?: string
          voicemail_email?: string
          voicemail_enabled?: boolean
        }
        Update: {
          business_name?: string
          created_at?: string
          dealer_id?: string
          forwarding_number?: string
          greeting_message?: string
          hold_music_type?: string
          id?: string
          ivr_enabled?: boolean
          option1_label?: string
          option2_label?: string
          option3_label?: string
          phone_number?: string | null
          status?: string
          updated_at?: string
          voicemail_email?: string
          voicemail_enabled?: boolean
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
