from pydantic import BaseModel
from .user import UserProfile

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

class TokenData(BaseModel):
    user_id: int
    email: str
