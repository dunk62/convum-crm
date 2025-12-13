// 자동 생성된 파일 - npm run update-schema 명령으로 업데이트하세요
// 생성일시: 2025-12-13T02:41:08.220Z

export const DB_SCHEMA = `
테이블: contacts
컬럼:
  - id: string (nullable)
  - account_id: string (nullable)
  - name: string (nullable)
  - position: string (nullable)
  - email: string (nullable)
  - phone: string (nullable)
  - department: string (nullable)
  - memo: string (nullable)
  - created_at: string (nullable)
  - updated_at: string (nullable)
  - grade: string (nullable)
  - sales_rep: string (nullable)
  - status: string (nullable)
  - source: string (nullable)
  - intro_mail_status: string (nullable)

테이블: opportunities
컬럼:
  - id: number (nullable)
  - created_at: string (nullable)
  - title: string (nullable)
  - company: string (nullable)
  - value: number (nullable)
  - stage: string (nullable)
  - date: string (nullable)
  - owner: string (nullable)
  - success_probability: number (nullable)
  - contact_name: string (nullable)
  - meeting_date: object (nullable)

테이블: opportunity_todos
컬럼:
  - id: string (nullable)
  - opportunity_id: number (nullable)
  - task_content: string (nullable)
  - is_completed: boolean (nullable)
  - created_at: string (nullable)

테이블: sales_performance
컬럼:
  - id: string (nullable)
  - shipment_date: string (nullable)
  - distributor_name: string (nullable)
  - company_name: string (nullable)
  - sales_rep: string (nullable)
  - product_name: string (nullable)
  - model_number: string (nullable)
  - quantity: number (nullable)
  - unit_price: number (nullable)
  - sales_amount: number (nullable)
  - created_at: string (nullable)
  - updated_at: string (nullable)

테이블: order_performance
컬럼:
  - id: string (nullable)
  - order_date: string (nullable)
  - distributor_name: string (nullable)
  - company_name: string (nullable)
  - sales_rep: string (nullable)
  - product_name: string (nullable)
  - model_number: string (nullable)
  - quantity: number (nullable)
  - unit_price: number (nullable)
  - total_amount: number (nullable)
  - created_at: string (nullable)

테이블: quote_items
컬럼:
  - id: string (nullable)
  - quote_id: string (nullable)
  - seq_no: number (nullable)
  - product_category: string (nullable)
  - description: string (nullable)
  - quantity: number (nullable)
  - standard_price: number (nullable)
  - special_price: number (nullable)
  - discount_rate: number (nullable)
  - created_at: string (nullable)
  - cost_price: number (nullable)
  - cost_price_lot: number (nullable)
  - user_price: number (nullable)
  - moq: number (nullable)
  - company_profit_rate: number (nullable)
  - store_profit_rate: number (nullable)
  - nego_rate: number (nullable)
  - expected_delivery: string (nullable)

테이블: quote_links
컬럼:
  - id: string (nullable)
  - quote_id: object (nullable)
  - quote_number: string (nullable)
  - recipient: string (nullable)
  - file_path: string (nullable)
  - public_url: string (nullable)
  - short_code: string (nullable)
  - created_at: string (nullable)
  - expires_at: string (nullable)
  - is_active: boolean (nullable)

테이블: quote_history
컬럼:
  - id: string (nullable)
  - quote_number: string (nullable)
  - recipient: string (nullable)
  - reference: string (nullable)
  - quote_date: string (nullable)
  - validity_date: string (nullable)
  - delivery_date: string (nullable)
  - payment_terms: string (nullable)
  - total_amount: number (nullable)
  - notes: string (nullable)
  - created_by: string (nullable)
  - created_at: string (nullable)
  - updated_at: string (nullable)

테이블: model_product_mapping
컬럼:
  - id: string (nullable)
  - model_number: string (nullable)
  - product_name: string (nullable)
  - created_at: string (nullable)
  - updated_at: string (nullable)

테이블: documents
컬럼:
  - id: number (nullable)
  - content: string (nullable)
  - metadata: object (nullable)
  - embedding: string (nullable)
  - created_at: string (nullable)
  - updated_at: string (nullable)

테이블: sample_inventory
컬럼:
  - id: string (nullable)
  - product_name: string (nullable)
  - model_code: string (nullable)
  - total_quantity: number (nullable)
  - description: string (nullable)
  - created_at: string (nullable)

테이블: cross_references
컬럼:
  - id: number (nullable)
  - maker: string (nullable)
  - competitor_model: string (nullable)
  - search_keyword: string (nullable)
  - convum_model: string (nullable)
  - compatibility_grade: string (nullable)
  - tech_checkpoint: string (nullable)
  - sales_point: string (nullable)
  - created_at: string (nullable)
  - updated_at: string (nullable)

테이블: email_queue
컬럼:
  - id: string (nullable)
  - contact_id: string (nullable)
  - status: string (nullable)
  - error_message: object (nullable)
  - created_at: string (nullable)

테이블: data_records
컬럼:
  - id: string (nullable)
  - type: string (nullable)
  - title: string (nullable)
  - content: string (nullable)
  - created_at: string (nullable)
  - company_name: string (nullable)
  - contact_name: string (nullable)
  - summary: string (nullable)
  - sentiment_score: number (nullable)
  - keywords: object (nullable)
  - next_action: object (nullable)
  - recording_link: string (nullable)
  - analysis_metadata: object (nullable)
`;

export const SCHEMA_METADATA = {
    generatedAt: '2025-12-13T02:41:08.222Z',
    tableCount: 14
};
