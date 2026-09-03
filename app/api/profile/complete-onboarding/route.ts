import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { profileId, ...onboardingData } = body;

    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID requis' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Construire l'objet de mise à jour
    const updateData: any = {
      phone: onboardingData.phone,
      date_of_birth: onboardingData.dateOfBirth,
      gender: onboardingData.gender,
      region: onboardingData.region,
      department: onboardingData.department,
      city: onboardingData.city,
      address: onboardingData.address,
      role: onboardingData.role,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Ajouter les champs spécifiques selon le rôle
    if (onboardingData.role === 'producer') {
      updateData.farm_name = onboardingData.farm_name;
      updateData.farm_size = onboardingData.farm_size;
      updateData.main_crops = onboardingData.main_crops;
      updateData.farming_experience = onboardingData.farming_experience;
    } else if (onboardingData.role === 'cooperative') {
      updateData.cooperative_name = onboardingData.cooperative_name;
      updateData.number_of_members = onboardingData.number_of_members;
      updateData.cooperative_registration = onboardingData.cooperative_registration;
    } else if (onboardingData.role === 'buyer') {
      updateData.company_name = onboardingData.company_name;
      updateData.business_type = onboardingData.business_type;
      updateData.purchase_capacity = onboardingData.purchase_capacity;
    } else if (onboardingData.role === 'supplier') {
      updateData.supplier_company = onboardingData.supplier_company;
      updateData.product_categories = onboardingData.product_categories;
      updateData.supplier_license = onboardingData.supplier_license;
    } else if (onboardingData.role === 'advisor') {
      updateData.specialization = onboardingData.specialization;
      updateData.certifications = onboardingData.certifications;
      updateData.years_of_experience = onboardingData.years_of_experience;
    }

    console.log('Updating profile:', profileId, updateData);

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', profileId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    console.log('Profile updated successfully:', updatedProfile);

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    console.error('Error in complete-onboarding:', error);
    return NextResponse.json(
      { 
        error: 'Failed to complete onboarding',
        details: error.message 
      },
      { status: 500 }
    );
  }
}