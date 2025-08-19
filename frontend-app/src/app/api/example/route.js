export async function POST(request) {
  try {
    const body = await request.json()
    const { message } = body
    
    // 예시 응답 (실제 사용 시 적절한 로직으로 변경)
    const response = {
      success: true,
      message: `서버에서 받은 메시지: ${message}`,
      timestamp: new Date().toISOString(),
    }
    
    return Response.json(response)
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        message: '요청 처리 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    success: true,
    message: 'API 서버가 정상적으로 작동 중입니다.',
    timestamp: new Date().toISOString(),
  })
}
