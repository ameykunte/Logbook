# from typing import List, Optional
from uuid import UUID
from services.connect_db import supabase
from models.Relationship import Relationship


class RelationshipDAO:
    def __init__(self):
        self.database = supabase

    def get_by_id(self, relationship_id: UUID, user_id: UUID):
        """
        Retrieve a relationship by its ID.
        """
        try:
            relationship_response = (
                self.database
                .from_("relationships")
                .select("relationship_id")
                .eq("user_id", user_id)
                .eq("relationship_id", relationship_id)
                .single()
                .execute()
            )
            return relationship_response
        except:
            return ''
    

    def get_by_user_id(self, user_id: UUID):
        """
        Retrieve all relationships for a specific user.
        """
        try:
            response = (self.database.from_("relationships").select("*").eq("user_id", user_id).execute())
            return response
        except:
            return ''

    def create(self, relationship: Relationship) -> None:
        """
        Create a new relationship.
        """
        try:
            create_response = (self.database
                            .from_("relationships")
                            .insert(relationship)
                            .execute())
            return create_response
        except:
            return ''
        
    def update(self, relationship: Relationship, relationship_id : UUID, user_id : UUID) -> None:
        """
        Update an existing relationship.
        """
        try:
            updated_response = (self.database
            .from_("relationships")
            .update(relationship)
            .eq("relationship_id", relationship_id)
            .eq("user_id", user_id)
            .execute())
            return updated_response
        except:
            return ''
        
    def delete(self, relationship_id : UUID, user_id : UUID) -> None:
        """
        Update an existing relationship.
        """
        try:
            deleted_response = (self.database
                        .from_("relationships")
                        .delete()
                        .eq("relationship_id", relationship_id)
                        .eq("user_id", user_id)
                        .execute())
            return deleted_response
        except:
            return ''

    # def archive(self, relationship_id: UUID) -> None:
    #     """
    #     Archive (soft delete) a relationship by its ID.
    #     """
    #     self.database.archive_relationship(relationship_id)
    